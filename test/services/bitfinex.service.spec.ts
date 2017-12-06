import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';

import { BitfinexService } from '../../src/services/bitfinex.service';

describe('ForeignExchangeService', () => {
  const mock = new MockAdapter(axios);
  const bitfinexService = new BitfinexService();

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

  it('Test getIOTAPrice', () => {
    bitfinexService.getIOTAPrice().subscribe(res => {
      expect(res.exchange).toEqual('bitfinex');
      expect(res.price).toEqual('4.71');
    });
  });
});
