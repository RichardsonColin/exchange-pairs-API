require('dotenv').config()
const express = require('express')
const app = express()

const schedule = require('node-schedule')
const requestJobs = require('./lib/request-jobs')
const API = 'coinGecko'
const jobsToRun = requestJobs[API]['jobs']

// Runs schedule every 1 hour
console.log('SERVICE STARTED...')
// schedule.scheduleJob('* */1 * * *', (time) => {
  console.log(`RUNNING... ${time}`)
  for(let reqJob in jobsToRun) {
    const jobFn = jobsToRun[reqJob]
    jobFn()
  }
// })

// ---------------------------------------------------------------------

// SERVER
const PORT = process.env.PORT || 3000
const HOST = 'localhost'

// Root route
app.get('/', function (req, res) {
  res.status(200).send('Become one with the universe.')
})

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
