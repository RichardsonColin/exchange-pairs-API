require('dotenv').config()
var express = require('express')
var app = express()
const schedule = require('node-schedule')
const requestJobs = require('./lib/request-jobs')

const API = 'coinGecko'
const jobsToRun = requestJobs[API]['jobs']

console.log('SERVICE STARTED...')

// Runs schedule every 29 min
schedule.scheduleJob('*/29 * * * *', (time) => {
  console.log(`RUNNING... ${time}`)
  for(let reqJob in jobsToRun) {
    const jobFn = jobsToRun[reqJob]
    jobFn()
  }
})

// SERVER

// Root route
app.get('/', function (req, res) {
  res.status(200).send('Become one with the universe.')
})

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
// const PORT = process.env.PORT || 3000
// const HOST = 'localhost'
// const requestListener = (req, res) => {
//   res.writeHead(200)
//   res.end("")
// }
// const server = http.createServer(requestListener)
// server.listen(PORT, HOST, () => {
//   console.log(`Server is running on http://${HOST}:${PORT}`)
// })

