const db = require('../db');

module.exports = {
  createMany: async (data) => {
    const queryStatement = `INSERT INTO exchange_asset_pair_references (exchange_id, asset_symbol, quote_symbol, asset_id, quote_id, is_stale)
        SELECT
          (SELECT id FROM exchanges WHERE api_id = $1),
          $2,
          $3,
          (SELECT id FROM assets WHERE symbol = $4),
          (SELECT id FROM assets WHERE symbol = $5),
          $6
        WHERE (SELECT id FROM exchanges WHERE api_id = $1) IS NOT NULL
        AND (SELECT id FROM assets WHERE symbol = $4) IS NOT NULL
        AND (SELECT id FROM assets WHERE symbol = $5) IS NOT NULL
        ON CONFLICT(exchange_id, asset_symbol, quote_symbol)
        DO UPDATE
        SET exchange_id = (SELECT id FROM exchanges WHERE api_id = $1),
          asset_symbol = $2,
          quote_symbol = $3,
          asset_id = (SELECT id FROM assets WHERE symbol = $4),
          quote_id = (SELECT id FROM assets WHERE symbol = $5),
          is_stale = $6;`;
    try {
      const finalizedQueries = [];

      for (let pairRef of data) {
        finalizedQueries.push(
          db.query(queryStatement, [
            pairRef.exchangeId,
            pairRef.assetSymbol,
            pairRef.quoteSymbol,
            pairRef.assetSymbol,
            pairRef.quoteSymbol,
            pairRef.isStale,
          ])
        );
      }

      return finalizedQueries;
    } catch (err) {
      // log err
      console.log(`${queryStatement}: `, err);
    }
  },
};
