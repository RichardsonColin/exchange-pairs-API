module.exports = {
  parseCryptoCompareData : apiData => {
    const parsedData = {
      exchanges: [],
      cryptocurrencies: [],
      basePairs: []
    }

    for(let exchange in apiData) {
      // only allow active exchanges
      if(apiData[exchange]['isActive']) {
        // add exchange
        parsedData.exchanges.push(exchange)
        for(let crypto in apiData[exchange]['pairs']) {
          // add crypto; only allow single crypto - e.g. API has {symbol}.CURR
          if(!crypto.includes('.')) parsedData.cryptocurrencies.push(crypto)
          for(let basePair in apiData[exchange]['pairs'][crypto]['tsyms']) {
            // add base pair
            parsedData.basePairs.push(basePair)
          }
        }
      }
    }

    // remove duplicates
    parsedData.exchanges = [...new Set(parsedData.exchanges)]
    parsedData.cryptocurrencies = [...new Set(parsedData.cryptocurrencies)]
    parsedData.basePairs = [...new Set(parsedData.basePairs)]

    return parsedData
  },
  utils: {
    getTimeSinceNow: (date) => {
      date = new Date(date)
      let now = Date.now()
      let timeDiff = Math.abs(date - now)
      return timeDiff
    }
  }
}