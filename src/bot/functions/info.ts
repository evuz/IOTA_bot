import * as TelegramBot from 'node-telegram-bot-api';
import { format } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';

import { bitfinexService, foreignExchangeService } from './../../services';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';

export const info = ({ msg }: ITelegramMessage): Observable<string> => {
  const chatId = msg.chat.id;

  return Observable.zip(
    bitfinexService.getIOTAPrice(),
    foreignExchangeService.getRates(),
  )
    .switchMap(([iota]) => {
      return Observable.zip(
        Observable.of(iota),
        foreignExchangeService.USDtoEUR(iota.price),
      );
    })
    .map(([{ timestamp, price }, eur]) => {
      const date = format(timestamp * 1000, 'DD/MM/YYYY');
      const hour = format(timestamp * 1000, 'HH:mm:ss');
      return (
        `IOTA price is from ${date} to ${hour}:\n` +
        `${(+price).toFixed(4)}$ = ${eur.toFixed(4)}€`
      );
    });
};
