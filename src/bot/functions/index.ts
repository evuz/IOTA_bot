import * as TelegramBot from 'node-telegram-bot-api';
import { IBot } from '../../interfaces/Bot';

import { echo } from './echo';
import { info } from './info';

export function addListeners(bot: IBot) {
  bot.addTextListener(/\/echo (.+)/, echo);
  bot.addTextListener(/\/info/, info);
}
