import * as TelegramBot from 'node-telegram-bot-api';
import { IBot } from '../../interfaces/Bot';

import { echo } from './echo';
import { info } from './info';
import { start } from './start';
import { onCallbackQuery } from './callbackQuery';

export function addListeners(bot: IBot) {
  bot.addTextListener(/\/echo (.+)/, echo);
  bot.addTextListener(/\/info/, info);
  bot.addTextListener(/\/start/, start);
  bot.addCallbackQuery(onCallbackQuery);
}
