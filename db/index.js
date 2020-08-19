const { Pool } = require('pg')

const ENV = process.env.NODE_ENV && process.env.NODE_ENV !== 'development' ?
  '' :
  '_TEST'

const db_config = {
  user: process.env.DB_USER + ENV,
  host: process.env.DB_HOST + ENV,
  database: process.env.DB_DATABASE + ENV,
  password: process.env.DB_PASSWORD + ENV,
  port: process.env.DB_PORT,
}

const pool = new Pool(db_config)

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