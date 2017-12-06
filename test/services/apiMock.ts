import * as MockAdapter from 'axios-mock-adapter';

export function mockBitfinexRequestIotaTrades(mock: MockAdapter) {
  mock
    .onGet('https://api.bitfinex.com/v1/trades/iotusd?limit_trades=1')
    .reply(200, [
      {
        timestamp: 1512556844,
        tid: 110823998,
        price: '4.71',
        amount: '500.0',
        exchange: 'bitfinex',
        type: 'sell'
      }
    ]);
}

export function mockFixerLatest(mock: MockAdapter) {
  mock.onGet('http://api.fixer.io/latest').reply(200, {
    base: 'EUR',
    date: '2017-12-05',
    rates: {
      USD: 1.1847
    }
  });
}
