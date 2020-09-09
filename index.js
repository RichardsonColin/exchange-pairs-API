require('dotenv').config()
const express = require('express')
const app = express()
const cron = require('node-cron')
// const schedule = require('node-schedule')

const requestJobs = require('./lib/request-jobs')
const API = 'coinGecko'
const jobsToRun = requestJobs[API]['jobs']

// ---------------------------------------------------------------------
// JOBS

// Runs schedule every hour at min 20
// cron.schedule('20 */3 * * *', () => {
  // let date = new Date().toJSON()
  // console.log(`I do the thing at: ${date}`)
  // for(let reqJob in jobsToRun) {
  //   const jobFn = jobsToRun[reqJob]
  //   jobFn()
  // }
// })

// ---------------------------------------------------------------------
// SERVER

const PORT = process.env.PORT || 3001
const HOST = 'localhost'

// Root route
app.get('*', function (req, res) {
  res.status(200).send('Become one with the universe.')
})

// Run server
app.listen(PORT, () => {
  console.log(`I be runnin on http://${HOST}:${PORT}`)
})
