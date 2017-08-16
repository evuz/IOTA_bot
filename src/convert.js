const axios = require('axios');

const url = 'http://api.fixer.io/latest';

function getRates() {
  return axios.get(url)
    .then(res => res.data.rates);
}

async function USDtoEUR(value) {
  const rates = await getRates();
  return value / rates.USD;
}

function convertTo(value, rate) {
  return (value * rate).toFixed(2);
}

module.exports = {
  USDtoEUR,
  getRates,
  convertTo
}
