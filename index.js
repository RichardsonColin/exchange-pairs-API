require('dotenv').config()
const https = require('https')
const schedule = require('node-schedule');
const requestJobs = require('./lib/request-jobs')

console.log('SERVICE STARTED...')

// runs schedule every 5 min
schedule.scheduleJob('*/5 * * * *', (time) => {
  console.log(`SCHEDULE RUNNING AT: ${time}`)

  for(let reqJob in requestJobs) {
    const options = requestJobs[reqJob]['options']
    const jobFn = requestJobs[reqJob]['requestFn']

    let request = https.request(options, async (res) => {
      const data = []
      console.log(`SENT REQUEST TO: ${options.hostname}${options.path}`)
      console.log(`RESPONSE STATUS: ${res.statusCode}`)
      console.log('HEADERS: ', res.headers)

      res.on('data', (d) => {
        data.push(d.toString())
      })

      res.on('end', async (err) => {
        if (res.statusCode === 200) {
          try {
            // parse API json data
            const result = JSON.parse(data.join('').trim())
            // call custom job fn
            jobFn(result)
          } catch (e) {
            console.log(`Error parsing JSON! ${e}`)
          }
        } else {
          console.log('Error: ', err, `Status: ${res.statusCode}`)
        }
      })
    })

    request.on('error', (err) => {
      console.error(err);
    })

    request.end()
  }
});
