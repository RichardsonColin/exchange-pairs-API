const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

module.exports = {
  query: async (text, params) => {
    const start = Date.now()
    try {
      const results = await pool.query(text, params)
      const duration = Date.now() - start
      // TODO: turn into logging fn
      // console.log('QUERY SUCCESS', { text, duration, rows: results.rowCount })
      return results
    } catch (err) {
      // log err
      console.log('QUERY ERROR', err)
    }
  },
}