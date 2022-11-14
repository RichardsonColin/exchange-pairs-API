// Models
const exchangeModel = require('../models/exchange');
const assetModel = require('../models/asset');
const pairReferenceModel = require('../models/exchange-asset-pair-reference');

// API Clients
const CoinGecko = require('./apis/coin-gecko/coin-gecko');
const CoinGeckoClient = new CoinGecko();

// GENERAL TODO: export jobFns to models

const idConverter = {
  gdax: 'coinbase',
};

module.exports = {
  coinGecko: {
    jobs: {
      getAssets: async () => {
        let status = await CoinGeckoClient.ping();

        if (status.code === 200) {
          console.log('Getting assets...');
          let assets = await CoinGeckoClient.coins.list();

          if (assets.data.length) {
            assetModel.createMany(assets.data);
          }
        }
      },
      getQuotes: async () => {
        let status = await CoinGeckoClient.ping();

        if (status.code === 200) {
          console.log('Getting quotes...');
          let quotes = await CoinGeckoClient.simple.supportedVsCurrencies();

          if (quotes.data.length) {
            let parsedQuotes = quotes.data.map((quote) => {
              return { id: quote, symbol: quote, name: quote };
            });
            assetModel.createMany(parsedQuotes);
          }
        }
      },
      getExchanges: async () => {
        let status = await CoinGeckoClient.ping();

        if (status.code === 200) {
          console.log('Getting exchanges...');
          let params = { page: 1, per_page: 250 };
          let hasResults = true;

          // while request returns results process data
          while (hasResults) {
            let exchanges = await CoinGeckoClient.exchanges.all(params);

            if (exchanges.data.length) {
              // upsert exchanges
              exchangeModel.createMany(exchanges.data);
              params.page++;
            } else {
              hasResults = false;
            }
          }
        }
      },
      createExchangeAssetPairs: async () => {
        let status = await CoinGeckoClient.ping();

        if (status.code === 200) {
          console.log('Creating pairs...');
          let exchanges = await exchangeModel.getAll();

          for (let exchange of exchanges) {
            let params = { page: 1 };
            let hasResults = true;

            // while request returns results process data
            while (hasResults) {
              let exchangesTickers =
                await CoinGeckoClient.exchanges.fetchTickers(
                  exchange.api_id,
                  params
                );

              if (
                typeof exchangesTickers !== 'undefined' &&
                'tickers' in exchangesTickers.data &&
                exchangesTickers.data.tickers.length
              ) {
                let parsedExchangeTickers = exchangesTickers.data.tickers.map(
                  (ticker) => {
                    return {
                      exchangeId: ticker.market.identifier,
                      assetSymbol:
                        'base' in ticker ? ticker.base.toLowerCase() : '',
                      quoteSymbol:
                        'target' in ticker ? ticker.target.toLowerCase() : '',
                      isStale: ticker.is_stale,
                    };
                  }
                );
                console.log(
                  `${exchange.api_id}: ${exchangesTickers.data.tickers.length}`
                );
                // upsert pair references
                pairReferenceModel.createMany(parsedExchangeTickers);
                params.page++;
              } else {
                hasResults = false;
              }
            }
          }
        }
      },
    },
  },
};
