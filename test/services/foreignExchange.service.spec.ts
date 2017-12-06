import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';

import { ForeignExchangeService } from '../../src/services/foreignExchange.service';
import { mockFixerLatest } from './apiMock';

describe('ForeignExchangeService', () => {
  const mock = new MockAdapter(axios);
  const foreignExchangeService = new ForeignExchangeService();

  beforeEach(() => {
    mockFixerLatest(mock);
  });

  it('Test getSymbol', () => {
    expect(foreignExchangeService.getSymbol('USD')).toEqual('$');
    expect(() => foreignExchangeService.getSymbol('US')).toThrow(
      'Currency not supported'
    );
  });

  it('Test getRates', done => {
    foreignExchangeService.getRates().subscribe(({ USD }) => {
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
