import * as TelegramBot from 'node-telegram-bot-api';
import { EventEmitter } from 'events';

import { IConfigBot } from '../interfaces/ConfigBot';

export function Bot({ token }: IConfigBot) {
  const bot = new TelegramBot(token, { polling: true });

  function addTextListener(event: RegExp, f: Function) {
    bot.onText(event, (msg, match) => {
      f(bot, { msg, match });
    });
  }

  return { addTextListener };
}