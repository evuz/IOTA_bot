import * as TelegramBot from 'node-telegram-bot-api';
import { format } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';

import { bitfinexService, foreignExchangeService } from './../../services';
import { createInlineKeyboard } from '../utils/createInlineKeyboard';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';

export const info = ({ msg }: ITelegramMessage): Observable<ITelegramSendMessage> => {
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
      const opts = createInlineKeyboard([{text: 'Update' }], 'infoIOTA');
      const text =
        `IOTA price is from ${date} to ${hour}:\n` +
        `${(+price).toFixed(4)}$ = ${eur.toFixed(4)}€`;
      return {
        text,
        opts,
      };
    });
};
