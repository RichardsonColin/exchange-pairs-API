// Models
const exchangeModel = require('../models/exchange')
const assetModel = require('../models/asset')
const pairReferenceModel = require('../models/exchange-asset-pair-reference')

// API Clients
const CoinGecko = require('./apis/coin-gecko/coin-gecko')
const CoinGeckoClient = new CoinGecko()

// GENERAL TODO: export jobFns to models

module.exports = {
  coinGecko: {
    jobs: {
      getAssets: async () => {
        let status = await CoinGeckoClient.ping()

        if(status.code === 200) {
          console.log('Getting assets...')
          let assets = await CoinGeckoClient.coins.list()

          if(assets.data.length) {
            assetModel.createMany(assets.data)
          }
        }
      },
      getQuotes: async () => {
        let status = await CoinGeckoClient.ping()

        if(status.code === 200) {
          console.log('Getting quotes...')
          let quotes = await CoinGeckoClient.simple.supportedVsCurrencies()

          if(quotes.data.length) {
            let parsedQuotes = quotes.data.map(quote => { return {id: quote, symbol: quote, name: quote} })
            assetModel.createMany(parsedQuotes)
          }
        }
      },
      getExchanges: async () => {
        let status = await CoinGeckoClient.ping()

        if(status.code === 200) {
          console.log('Getting exchanges...')
          let params = { page: 1, per_page: 250 }
          let hasResults = true

          // get all exhanges request
          const request = async (params) => {
            return CoinGeckoClient.exchanges.all(params)
          }

          // while request returns results process data
          while(hasResults) {
            let exchanges = await request(params)

            if(exchanges.data.length) {
              // upsert exchanges
              exchangeModel.createMany(exchanges.data)
              params.page++
            } else {
              hasResults = false
            }
          }
        }
      },
      createExchangeAssetPairs: async () => {
        let status = await CoinGeckoClient.ping()

        if(status.code === 200) {
          console.log('Creating pairs...')
          let exchanges = await exchangeModel.getAll()

          for(let exchange of exchanges) {
            let params = { page: 1 }
            let hasResults = true

            // get all exhanges request
            const request = async (id, params) => {
              return CoinGeckoClient.exchanges.fetchTickers(id, params)
            }

            // while request returns results process data
            while(hasResults) {
              let exchangesTickers = await request(exchange.api_id, params)

              if('tickers' in exchangesTickers.data && exchangesTickers.data.tickers.length) {
                let parsedExchangeTickers = exchangesTickers.data.tickers.map(ticker => {
                  return {
                    exchangeId: ticker.market.identifier,
                    assetId: ticker.coin_id,
                    quoteId: 'target_coin_id' in ticker ? ticker.target_coin_id : ticker.target,
                    isStale: ticker.is_stale
                  }
                })
                // upsert pair references
                pairReferenceModel.createMany(parsedExchangeTickers)
                params.page++
              } else {
                hasResults = false
              }
            }
          }
        }
      }
    }
  }
  // cryptoCompare: {
  //   multiData: {
  //     options: {
  //       'method': 'GET',
  //       'hostname': 'min-api.cryptocompare.com',
  //       'path': '/data/v4/all/exchanges',
  //       'headers': {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Apikey ${process.env.API_KEY}`
  //       }
  //     },
  //     jobFn: async (result) => {
  //       const parsedApiData = helpers.parseCryptoCompareData(result.Data.exchanges)

  //       await queries.createMany(parsedApiData.exchanges, 'INSERT INTO exchanges (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;')
  //       await queries.createMany(parsedApiData.cryptocurrencies, 'INSERT INTO cryptocurrencies (symbol) VALUES ($1) ON CONFLICT (symbol) DO NOTHING;')
  //       await queries.createMany(parsedApiData.basePairs, 'INSERT INTO base_pairs (symbol) VALUES ($1) ON CONFLICT (symbol) DO NOTHING;')
  //       queries.cryptoCompare.createRelationship(result.Data.exchanges)
  //     }
  //   },
  //   exchangeInfo: {
  //     options: {
  //       'method': 'GET',
  //       'hostname': 'min-api.cryptocompare.com',
  //       'path': '/data/exchanges/general',
  //       'headers': {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Apikey ${process.env.API_KEY}`
  //       }
  //     },
  //     jobFn: (result) => {
  //       queries.cryptoCompare.updateExchangeInfo(result.Data)
  //     }
  //   }
  // },
  // coinApi: {
  //   options: {
  //     'method': 'GET',
  //     'hostname': 'rest.coinapi.io',
  //     'path': '',
  //     'headers': {'X-CoinAPI-Key': process.env.COINAPI_API_KEY}
  //   },
  //   jobs: {
  //     exchanges: {
  //       path: '/v1/exchanges',
  //       jobFn: async (exchanges) => {
  //         console.log('exchanges')
  //         const queryStatement = 'INSERT INTO exchanges (api_id, name, website_url, volume_1_hour, volume_1_day, volume_1_month) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO NOTHING;'
  //         await exchanges.map(exchange => {
  //           let exchangeId = exchange.exchange_id in converter ? converter[exchange.exchange_id]['api_id'] : exchange.exchange_id
  //           let name = exchange.exchange_id in converter ? converter[exchange.exchange_id]['name'] : exchange.name
  //           // remove any trailing parantheses and characters within them
  //           name = name.split(/\s*[+*)(](?![^[]*])\s*/)[0]
  //           return queries.createOne([
  //             exchangeId,
  //             name,
  //             exchange.website,
  //             exchange.volume_1hrs_usd,
  //             exchange.volume_1day_usd,
  //             exchange.volume_1mth_usd],
  //             queryStatement
  //           )
  //         })
  //       }
  //     },
  //     ExchangeIcons: {
  //       path: '/v1/exchanges/icons/200',
  //       jobFn: async (icons) => {
  //         console.log('exchange icons')
  //         const queryStatement = `UPDATE exchanges SET logo_url = $1,
  //           updated_at = CASE
  //             WHEN logo_url <> $1::varchar
  //             THEN $2 ELSE updated_at
  //           END WHERE api_id = $3;`
  //         const timestamp = new Date().toISOString()
  //         await icons.map(icon => {
  //           let exchangeId = icon.exchange_id in converter ? converter[icon.exchange_id]['api_id'] : icon.exchange_id
  //           return queries.updateOne([icon.url, timestamp, exchangeId], queryStatement)
  //         })
  //       }
  //     },
  //     assets: {
  //       path: '/v1/assets',
  //       jobFn: async (assets) => {
  //         console.log('assets')
  //         const queryStatement = 'INSERT INTO assets (symbol, name) VALUES ($1, $2) ON CONFLICT (symbol) DO NOTHING;'
  //         await assets.map(asset => {
  //           return queries.createOne([asset.asset_id, asset.name], queryStatement)
  //         })
  //       }
  //     },
  //     assetIcons: {
  //       path: '/v1/assets/icons/200',
  //       jobFn: async (icons) => {
  //         console.log('asset icons')
  //         const queryStatement = `UPDATE assets SET logo_url = $1,
  //           updated_at = CASE
  //             WHEN logo_url <> $1::varchar
  //             THEN $2 ELSE updated_at
  //           END WHERE symbol = $3;`
  //         const timestamp = new Date().toISOString()
  //         await icons.map(icon => {
  //           return queries.updateOne([icon.url, timestamp, icon.asset_id], queryStatement)
  //         })
  //       }
  //     },
  //     symbols: {
  //       path: '/v1/symbols',
  //       jobFn: async (symbols) => {
  //         console.log('symbols')
  //         const queryStatement = `INSERT INTO exchange_asset_pair_references (exchange_id, base_id, quote_id, type, quote_start)
  //           SELECT
  //             (SELECT id FROM exchanges WHERE api_id = $1),
  //             (SELECT id FROM assets WHERE symbol = $2),
  //             (SELECT id FROM assets WHERE symbol = $3),
  //             $4,
  //             $5
  //           WHERE (SELECT id FROM exchanges WHERE api_id = $1) IS NOT NULL
  //           AND (SELECT id FROM assets WHERE symbol = $2) IS NOT NULL
  //           AND (SELECT id FROM assets WHERE symbol = $3) IS NOT NULL
  //           ON CONFLICT DO NOTHING;`

  //         await symbols.map(symbol => {
  //           let exchangeId = symbol.exchange_id in converter ? converter[symbol.exchange_id]['api_id'] : symbol.exchange_id
  //           if('data_start' in symbol && 'exchange_id' in symbol && 'asset_id_base' in symbol && 'asset_id_quote' in symbol) {
  //             let timeSinceLastTrade = helpers.utils.getTimeSinceNow(symbol['data_trade_end'])
  //             // last trade since 10 days ago
  //             if(timeSinceLastTrade < 864000000) {
  //               // if(!exchangeBlackList.includes(symbol.exchange_id.toString()) && !assetBlackList.includes(symbol.asset_id_base.toString()) && !assetBlackList.includes(symbol.asset_id_quote.toString())) {
  //                 return queries.createOne([exchangeId, symbol.asset_id_base, symbol.asset_id_quote, symbol.symbol_type, symbol.data_quote_start], queryStatement)
  //               // }
  //             }
  //           }
  //         })
  //       }
  //     }
  //   }
  // }
}