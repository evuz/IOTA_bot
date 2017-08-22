const axios = require('axios');

const url = 'https://api.bitfinex.com/v1/';

function getIOTAPrice() {
  return axios.get(`${url}trades/iotusd?limit_trades=1`)
    .then(res => res.data[0]);
}


function getAveragePrice(requestNumber) {
  return axios.get(`${url}trades/iotusd?limit_trades=${requestNumber}`)
    .then(res => {
      const acum = res.data.reduce((acum, { price }) => acum + parseFloat(price), 0)
      return {
        avg: acum / requestNumber,
        current: res.data[0].price
      }
    });
}

module.exports = {
  getIOTAPrice,
  getAveragePrice
}
