const db = require('../db');

module.exports = {
  getAll: async () => {
    const queryStatement = 'SELECT * FROM assets;';
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
      'INSERT INTO assets (api_id, symbol, name) VALUES (LOWER($1), $2, $3) ON CONFLICT DO NOTHING;';
    try {
      const finalizedQueries = [];

      for (let asset of data) {
        finalizedQueries.push(
          db.query(queryStatement, [asset.id, asset.symbol, asset.name])
        );
      }

      return finalizedQueries;
    } catch (err) {
      // log err
      console.log(`${queryStatement}: `, err);
    }
  },
};
