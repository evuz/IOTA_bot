import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { CacheService } from '../../src/services/cache.service';
import { mockFixerLatest, mockBitfinexRequestIotaTrades } from './apiMock';

describe('CacheService', () => {
  const mock = new MockAdapter(axios, { delayResponse: 200 });
  let cacheService: CacheService;

  beforeEach(() => {
    mockFixerLatest(mock);
    mockBitfinexRequestIotaTrades(mock);
    cacheService = new CacheService();
  });

  it(
    'Same requests with delay',
    done => {
      let flag = false;
      cacheService
        .request('http://api.fixer.io/latest')
        .switchMap(() => {
          setTimeout(() => (flag = true), 10);
          return cacheService.request('http://api.fixer.io/latest');
        })
        .subscribe(() => {
          if (!flag) done();
        });
    },
    500
  );

  it(
    'Same requests without delay',
    done => {
      let flag = false;
      let response: any;
      cacheService
        .request('http://api.fixer.io/latest')
        .subscribe(res => (response = res));
      setTimeout(() => {
        cacheService.request('http://api.fixer.io/latest').subscribe(res => {
          if (!flag) {
            expect(response).toEqual(res);
            done();
          }
        });
        setTimeout(() => (flag = true), 150);
      }, 100);
    },
    500
  );

  it(
    'Diferents requests with delay',
    done => {
      let flag = false;
      cacheService
        .request('http://api.fixer.io/latest')
        .switchMap(() => {
          setTimeout(() => (flag = true), 10);
          return cacheService.request(
            'https://api.bitfinex.com/v1/trades/iotusd?limit_trades=1'
          );
        })
        .subscribe(() => {
          if (flag) done();
        });
    },
    500
  );
});
