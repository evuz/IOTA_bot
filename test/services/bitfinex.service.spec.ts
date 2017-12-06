import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';

import { BitfinexService } from '../../src/services/bitfinex.service';
import { mockBitfinexRequestIotaTrades } from './apiMock';

describe('ForeignExchangeService', () => {
  const mock = new MockAdapter(axios);
  const bitfinexService = new BitfinexService();

  beforeEach(() => {
    mockBitfinexRequestIotaTrades(mock);
  });

  it('Test getIOTAPrice', () => {
    bitfinexService.getIOTAPrice().subscribe(res => {
      expect(res.exchange).toEqual('bitfinex');
      expect(res.price).toEqual('4.71');
    });
  });
});
