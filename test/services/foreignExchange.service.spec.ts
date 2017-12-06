import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';

import { ForeignExchangeService } from '../../src/services/foreignExchange.service';

describe('ForeignExchangeService', () => {
  const mock = new MockAdapter(axios);
  const foreignExchangeService = new ForeignExchangeService();

  mock.onGet('http://api.fixer.io/latest').reply(200, {
    base: 'EUR',
    date: '2017-12-05',
    rates: {
      'USD': 1.1847
    }
  });

  it('Test getSymbol', () => {
    expect(foreignExchangeService.getSymbol('USD')).toEqual('$');
    expect(() => foreignExchangeService.getSymbol('US')).toThrow('Currency not supported');
  });

  it('Test getRates', done => {
    foreignExchangeService.getRates().subscribe(({USD}) => {
      expect(USD).toEqual(1.1847);
      done();
    });
  });

  it('Test USDtoEUR', done => {
    foreignExchangeService.USDtoEUR(3).subscribe(res => {
      expect(res.toFixed(4)).toEqual('2.5323');
      done();
    });
  });
});
