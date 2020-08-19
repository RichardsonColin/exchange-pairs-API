require('dotenv').config()
const http = require('http')
const schedule = require('node-schedule')
const requestJobs = require('./lib/request-jobs')

const API = 'coinGecko'
const jobsToRun = requestJobs[API]['jobs']

console.log('SERVICE STARTED...')

// Runs schedule every 10 min
schedule.scheduleJob('*/10 * * * *', (time) => {
  console.log(`RUNNING... ${time}`)
  for(let reqJob in jobsToRun) {
    const jobFn = jobsToRun[reqJob]
    jobFn()
  }
})

// Run server
const PORT = process.env.SERVER_PORT || 3000
const HOST = 'localhost'
const requestListener = (req, res) => {
  res.writeHead(200)
  res.end("")
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})

