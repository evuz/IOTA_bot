import * as TelegramBot from 'node-telegram-bot-api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { bitfinexService, foreignExchangeService } from './../../services';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';

export const info = (telegramBot: TelegramBot, { msg }: ITelegramMessage) => {
  const chatId = msg.chat.id;

  try {
    Observable.zip(bitfinexService.getIOTAPrice(), foreignExchangeService.getRates()).subscribe(([iota]) => {
      const { price } = iota;
    });
  } catch (err) {
    throw new Error(err);
  }
};
