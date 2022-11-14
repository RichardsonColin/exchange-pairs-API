const db = require('../db');

module.exports = {
  getAll: async () => {
    const queryStatement = 'SELECT * FROM exchanges;';
    try {
      const { rows } = await db.query(queryStatement, []);
      return rows;
    } catch (err) {
      // log err
      console.log(`${queryStatement}: `, err);
    }
  },
  createMany: async (data) => {
    const queryStatement =
      'INSERT INTO exchanges (api_id, name, url, image, origin, grade, volume_24_hour) VALUES (LOWER($1), $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING;';
    try {
      const finalizedQueries = [];

      for (let exchange of data) {
        finalizedQueries.push(
          db.query(queryStatement, [
            exchange.id,
            exchange.name,
            exchange.url,
            exchange.image,
            exchange.country,
            exchange.trust_score,
            exchange.trade_volume_24h_btc_normalized,
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
