const db = require('../db')

module.exports = {
  createMany: async data => {
    try {
      const queryStatement = `INSERT INTO exchange_asset_pair_references (exchange_id, asset_symbol, quote_symbol, is_stale)
        SELECT
          (SELECT id FROM exchanges WHERE api_id = $1),
          $2,
          $3,
          $4
        WHERE (SELECT id FROM exchanges WHERE api_id = $1) IS NOT NULL
        ON CONFLICT DO NOTHING;`
      const finalizedQueries = []

      for(let pairRef of data) {
        finalizedQueries.push(db.query(queryStatement,
          [
            pairRef.exchangeId,
            pairRef.assetSymbol,
            pairRef.quoteSymbol,
            pairRef.isStale
          ]
        ))
      }

      return finalizedQueries
    } catch (err) {
      // log err
      console.log('createMany exchanges error: ', err)
    }
  },
}