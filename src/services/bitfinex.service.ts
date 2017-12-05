import axios from 'axios';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

import { CacheService } from './cache.service';

export class BitfinexService extends CacheService {
  private baseUrl = 'https://api.bitfinex.com/v1/';

  getIOTAPrice() {
    const url = `${this.baseUrl}trades/iotusd?limit_trades=1`;
    return this.request(url).map(res => res[0]);
  }
}
