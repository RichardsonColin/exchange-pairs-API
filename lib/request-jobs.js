const helpers = require('./helpers')
const queries = require('./queries')

// const options = {
//   "method": "GET",
//   "hostname": "api.cryptoapis.io",
//   "path": "/v1/exchanges",
//   "headers": {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'bbdaa2d8e03b8a2fab4e8ece9d62b17d7462d9b1'
//   }
// };

// const options = {
//   "method": "GET",
//   "hostname": "rest.coinapi.io",
//   "path": "/v1/exchanges",
//   "headers": {
//     "Accept": "application/json",
//     "X-CoinAPI-Key": "0008A26B-233C-4F3E-A997-CE230B3BECB1"
//   }
// };

module.exports = {
  multiData: {
    options: {
      'method': 'GET',
      'hostname': 'min-api.cryptocompare.com',
      'path': '/data/v4/all/exchanges',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${process.env.API_KEY}`
      }
    },
    requestFn: async (result) => {
      const parsedApiData = helpers.parseCryptoCompareData(result.Data.exchanges)

      await queries.createMany(parsedApiData.exchanges, 'INSERT INTO exchanges (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;')
      await queries.createMany(parsedApiData.cryptocurrencies, 'INSERT INTO cryptocurrencies (symbol) VALUES ($1) ON CONFLICT (symbol) DO NOTHING;')
      await queries.createMany(parsedApiData.basePairs, 'INSERT INTO base_pairs (symbol) VALUES ($1) ON CONFLICT (symbol) DO NOTHING;')
      queries.cryptoCompare.createRelationship(result.Data.exchanges)
    }
  },
  exchangeInfo: {
    options: {
      'method': 'GET',
      'hostname': 'min-api.cryptocompare.com',
      'path': '/data/exchanges/general',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${process.env.API_KEY}`
      }
    },
    requestFn: (result) => {
      queries.cryptoCompare.updateExchangeInfo(result.Data)
    }
  }
}