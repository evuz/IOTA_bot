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

function getSymbol(currency) {
  const symbols = {
    EUR: '€',
    USD: '$'
  }
  const symbol = symbols[currency];
  if (!symbol) throw new Error('Currency not supported');
  return symbol;
}

module.exports = {
  USDtoEUR,
  getRates,
  getSymbol,
  convertTo
}
