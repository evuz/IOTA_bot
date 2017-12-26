import * as TelegramBot from 'node-telegram-bot-api';
import { format } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { users } from '../../db/index';

import { foreignExchangeService } from './../../services/index';

import { monospaceFormat } from '../utils/format/monospace';
import { getIotaPriceEur } from '../utils/getIotaPriceEur';
import { createInlineKeyboard } from '../utils/createInlineKeyboard';
import { generateInfoEurPrice } from '../utils/generateInfoEurPrice';
import { generateInfoUser } from '../utils/generateInfoUser';

import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';

export const myInfo = ({ msg }): Observable<ITelegramSendMessage> => {
  const userId = msg.from.id;
  return getIotaPriceEur().map(([{ timestamp, price }, eur]) => {
    const user = users.getUser(userId);
    const infoText = generateInfoEurPrice(price, eur, timestamp);
    const opts = Object.assign(createInlineKeyboard([{ text: 'Update' }], 'myInfo'), { parse_mode: 'markdown' });
    try {
      const priceToUse = user.currency === 'EUR' ? eur : price;
      const userText = generateInfoUser(user, +priceToUse, { currency: foreignExchangeService.getSymbol(user.currency) });
      const text = `${infoText}\n\n${userText}`;
      return {
        text: monospaceFormat(text),
        opts,
      };
    } catch (err) {
      return {
        text: `${err}`,
      };
    }
  });
};
