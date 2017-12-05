import axios from 'axios';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

export class CacheService {
  private expiringTime = 10 * 1000;
  private expiring = new Map<string, number>();
  private cacheData = new Map<string, {}>();

  request(url): Observable<any> {
    if (this.expiring.get(url) > Date.now()) {
      return Observable.create(obs => obs.next(this.cacheData.get(url)));
    } else {
      return Observable.fromPromise(axios.get(url)).map(res => {
        const data = res.data;
        this.expiring.set(url, Date.now() + this.expiringTime);
        this.cacheData.set(url, data);
        return data;
      });
    }
  }
}
