import { bitfinexService, foreignExchangeService } from './../../services';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';

export function getIotaPriceEur() {
  return Observable.zip(bitfinexService.getIOTAPrice(), foreignExchangeService.getRates()).switchMap(([iota]) => {
    return Observable.zip(Observable.of(iota), foreignExchangeService.USDtoEUR(iota.price));
  });
}
