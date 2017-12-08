import { SendMessageOptions } from 'node-telegram-bot-api';

export interface ITelegramSendMessage {
  text: string;
  opts?: SendMessageOptions;
}
