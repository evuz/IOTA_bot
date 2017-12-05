import axios from 'axios';
import { Observable } from 'rxjs/Observable';

import { CacheService } from './cache.service';

export class ForeignExchangeService extends CacheService {
  private baseUrl = 'http://api.fixer.io/';
  private symbols = {
    EUR: '€',
    USD: '$',
  };

  USDtoEUR(value): Observable<number> {
    return this.getRates().map(rates => value / rates.USD);
  }

  getSymbol(currency): string {
    const symbol = this.symbols[currency];
    if (!symbol) throw new Error('Currency not supported');
    return symbol;
  }

  getRates(): Observable<any> {
    const url = `${this.baseUrl}latest`;
    return this.request(url).map(({ rates }) => rates);
  }
}
