const Bottleneck = require('bottleneck/es5')

// Documentation: https://www.npmjs.com/package/bottleneck

/**
 * @typedef {Object} Init
 * @description - Creates an instance of the Bottleneck class to limit class http requests
 * @param {number} reservoir - An amount of total requests to send in a batch at once
 * @param {number} reservoirRefreshAmount - An amount to refresh the batch of requests
 * @param {number} reservoirRefreshInterval - How often to refresh the total requests in a batch (must be divisible by 250; in ms)
 * @param {number} maxConcurrent - An amount of allowable requests at one time
 * @param {number} minTime - An amount of time between requests (in ms)
 * @property {number} reservoir - An amount of total requests to send in a batch at once
 * @property {number} reservoirRefreshAmount - An amount to refresh the batch of requests
 * @property {number} reservoirRefreshInterval - How often to refresh the total requests in a batch (must be divisible by 250; in ms)
 * @property {number} maxConcurrent - An amount of allowable requests at one time
 * @property {number} minTime - An amount of time between requests (in ms)
 */

const Init = (reservoir, reservoirRefreshAmount, reservoirRefreshInterval, maxConcurrent, minTime) => {
  return new Bottleneck({
    reservoir,
    reservoirRefreshAmount,
    reservoirRefreshInterval,
    maxConcurrent,
    minTime
  })
}

/**
 * @typedef {Object} AddToQueue
 * @description - Adds class requests to queue as to not hit API threshold
 * @param {function} requestFn - An http request promise
 * @param {class} limiter - An instance of the Bottleneck class
 */

const AddToQueue = async (requestFn, limiter) => {
  try {
    const queued = limiter.wrap(requestFn)
    const result = await queued()

    return result
  } catch (error) {
    console.log('Request queue error: ', error)
  }
}

//

module.exports = {
  AddToQueue,
  Init
};