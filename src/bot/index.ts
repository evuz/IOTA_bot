import * as TelegramBot from 'node-telegram-bot-api';
import { EventEmitter } from 'events';

import { IConfigBot } from '../interfaces/ConfigBot';
import { ITelegramSendMessage } from '../interfaces/TelegramSendMessage';

export function Bot({ token }: IConfigBot) {
  const bot = new TelegramBot(token, { polling: true });

  function addTextListener(event: RegExp, f: Function) {
    bot.onText(event, (msg, match) => {
      f({ msg, match }).subscribe(({ text, opts }: ITelegramSendMessage) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, text, opts);
      });
    });
  }

  function addCallbackQuery(f: Function) {
    bot.on('callback_query', callbackQuery => {
      f(bot, callbackQuery);
    });
  }

  return { addTextListener, addCallbackQuery };
}
