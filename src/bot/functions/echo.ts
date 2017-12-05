import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';

export const echo = (telegramBot: TelegramBot, { msg, match }: ITelegramMessage) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  telegramBot.sendMessage(chatId, resp);
};
