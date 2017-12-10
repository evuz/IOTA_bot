import * as TelegramBot from 'node-telegram-bot-api';
import { IBot } from '../../interfaces/Bot';

import { echo } from './echo';
import { info } from './info';
import { onCallbackQuery } from './callbackQuery';

export function addListeners(bot: IBot) {
  bot.addTextListener(/\/echo (.+)/, echo);
  bot.addTextListener(/\/info/, info);
  bot.addCallbackQuery(onCallbackQuery);
}
