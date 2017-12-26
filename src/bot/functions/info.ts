import * as TelegramBot from 'node-telegram-bot-api';
import { format } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { chats } from './../../db/index';

import { getIotaPriceEur } from '../utils/getIotaPriceEur';
import { createInlineKeyboard } from '../utils/createInlineKeyboard';
import { generateInfoEurPrice } from '../utils/generateInfoEurPrice';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';

export const info = ({ msg }): Observable<ITelegramSendMessage> => {
  const chatId = msg.chat.id;
  const timezone = chats.getTimezone(chatId);
  return getIotaPriceEur().map(([{ timestamp, price }, eur]) => {
    const opts = createInlineKeyboard([{ text: 'Update' }], 'infoIOTA');
    return {
      text: generateInfoEurPrice(price, eur, { timestamp, timezoneOffset: timezone }),
      opts,
    };
  });
};
