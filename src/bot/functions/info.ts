import * as TelegramBot from 'node-telegram-bot-api';
import { format } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { getIotaPriceEur } from '../utils/getIotaPriceEur';
import { createInlineKeyboard } from '../utils/createInlineKeyboard';
import { generateInfoEurPrice } from '../utils/generateInfoEurPrice';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';

export const info = (): Observable<ITelegramSendMessage> => {
  return getIotaPriceEur().map(([{ timestamp, price }, eur]) => {
    const opts = createInlineKeyboard([{ text: 'Update' }], 'infoIOTA');
    return {
      text: generateInfoEurPrice(price, eur, timestamp),
      opts,
    };
  });
};
