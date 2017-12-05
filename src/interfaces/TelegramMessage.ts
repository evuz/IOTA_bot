import { Message } from 'node-telegram-bot-api';

export interface ITelegramMessage {
  msg: Message;
  match: RegExpExecArray;
}
