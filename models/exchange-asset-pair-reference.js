const db = require('../db')

module.exports = {
  createMany: async data => {
    try {
      const queryStatement = `INSERT INTO exchange_asset_pair_references (exchange_id, asset_id, quote_id, is_stale)
        SELECT
          (SELECT id FROM exchanges WHERE api_id = $1),
          (SELECT id FROM assets WHERE LOWER(api_id) = LOWER($2)),
          (SELECT id FROM assets WHERE LOWER(api_id) = LOWER($3)),
          $4
        WHERE (SELECT id FROM exchanges WHERE api_id = $1) IS NOT NULL
        AND (SELECT id FROM assets WHERE LOWER(api_id) = LOWER($2)) IS NOT NULL
        AND (SELECT id FROM assets WHERE LOWER(api_id) = LOWER($3)) IS NOT NULL
        ON CONFLICT DO NOTHING;`
      const finalizedQueries = []

      for(let pairRef of data) {
        finalizedQueries.push(db.query(queryStatement,
          [
            pairRef.exchangeId,
            pairRef.assetId,
            pairRef.quoteId,
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