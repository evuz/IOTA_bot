const axios = require('axios');

const url = 'https://api.bitfinex.com/v1/';

function getIOTAPrice() {
    return axios.get(`${url}trades/iotusd?limit_trades=1`)
        .then(res => res.data[0]);
}

module.exports = {
    getIOTAPrice
}
