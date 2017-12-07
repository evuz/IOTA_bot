import axios from 'axios';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

export class CacheService {
  private expiringTime = 10 * 1000;
  private expiring = new Map<string, number>();
  private cacheData = new Map<string, {}>();
  private requestPending = new Map<string, Observable<any>>();

  request(url): Observable<any> {
    if (this.requestPending.get(url)) {
      return this.requestPending.get(url);
    } else {
      if (this.expiring.get(url) > Date.now()) {
        return Observable.create(obs => obs.next(this.cacheData.get(url)));
      } else {
        const obs = Observable.fromPromise(axios.get(url)).map(res => {
          const data = res.data;
          this.requestPending.delete(url);
          this.expiring.set(url, Date.now() + this.expiringTime);
          this.cacheData.set(url, data);
          return data;
        });
        this.requestPending.set(url, obs);
        return obs;
      }
    }
  }
}
