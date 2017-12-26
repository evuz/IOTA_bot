import * as TelegramBot from 'node-telegram-bot-api';
import { IBot } from '../../interfaces/Bot';

import { echo } from './echo';
import { info } from './info';
import { start } from './start';
import { setIota } from './setIota';
import { setInvestment } from './setInvestment';
import { setName } from './setName';
import { myInfo } from './myInfo';
import { onCallbackQuery } from './callbackQuery';

export function addListeners(bot: IBot) {
  bot.addTextListener(/\/echo (.+)/, echo);
  bot.addTextListener(/\/info/, info);
  bot.addTextListener(/\/start/, start);
  bot.addTextListener(/\/set_iota (.+)/, setIota);
  bot.addTextListener(/\/set_investment (.+)/, setInvestment);
  bot.addTextListener(/\/set_alias (.+)/, setName);
  bot.addTextListener(/\/my_info/, myInfo);
  bot.addCallbackQuery(onCallbackQuery);
}
