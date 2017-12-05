import axios from 'axios';
import { Observable } from 'rxjs/Observable';

import { CacheService } from './cache.service';
import { IBitfinexTrades } from '../interfaces/BitfinexTrades';

export class BitfinexService extends CacheService {
  private baseUrl = 'https://api.bitfinex.com/v1/';

  getIOTAPrice(): Observable<IBitfinexTrades> {
    const url = `${this.baseUrl}trades/iotusd?limit_trades=1`;
    return this.request(url).map(res => res[0]);
  }
}
