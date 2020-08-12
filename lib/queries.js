const db = require('../db')

module.exports = {
  createMany: async (arr, queryStatement) => {
    try {
      const finalizedQueries = []

      for(let each of arr) {
        finalizedQueries.push(db.query(queryStatement, [each]))
      }

      return finalizedQueries
    } catch (err) {
      // log err
      console.log('createMany error: ', err)
    }
  },
  cryptoCompare: {
    createRelationship: async data => {
      try {
        // TODO: use pg version of SQL variables
        let queryStatement = `INSERT INTO exchange_cryptocurrency_base_pair_references (exchange_id, cryptocurrency_id, base_pair_id)
          SELECT
            (SELECT id FROM exchanges WHERE name = $1),
            (SELECT id FROM cryptocurrencies WHERE symbol = $2),
            (SELECT id FROM base_pairs WHERE symbol = $3)
          WHERE NOT EXISTS (
            SELECT 1 FROM exchange_cryptocurrency_base_pair_references ref
            WHERE ref.exchange_id = (SELECT id FROM exchanges WHERE name = $1)
            AND ref.cryptocurrency_id = (SELECT id FROM cryptocurrencies WHERE symbol = $2)
            AND ref.base_pair_id = (SELECT id FROM base_pairs WHERE symbol = $3)
          );`

        for(let exchange in data) {
          // only allow active exchanges
          if(data[exchange]['isActive']) {
            for(let crypto in data[exchange]['pairs']) {
              // Only allow single symbol crypto
              if(!crypto.includes('.')) {
                for(let basePair in data[exchange]['pairs'][crypto]['tsyms']) {
                  db.query(queryStatement, [exchange, crypto, basePair])
                }
              }
            }
          }
        }
      } catch(err) {
        console.log('createRelationship error: ', err)
      }
    },
    updateExchangeInfo: async data => {
      try {
        let timestamp = new Date().toISOString()
        let queryStatement = `UPDATE exchanges
          SET description = $1, website_url = $2, logo_url = $3, country_origin = $4, grade = $5, volume_24_hour = $6, updated_at = $7
          WHERE LOWER(name) = LOWER($8)
          OR LOWER(name) = LOWER($9);`
        for(let exchange in data) {
          let d = data[exchange]
          let logoUrl = `https://cryptocompare.com${d.LogoUrl}`
          // TODO: use regex to parse '{dot}{chars}{/}'
          let websiteUrl = d.AffiliateURL.split('?')[0]

          db.query(queryStatement, [
            d.Description,
            websiteUrl,
            logoUrl,
            d.Country,
            d.Grade,
            d.TOTALVOLUME24H.BTC,
            timestamp,
            d.Name,
            d.InternalName
          ])
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
}