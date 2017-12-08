import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';

export const echo = ({ msg, match }: ITelegramMessage): Observable<ITelegramSendMessage> => {
  const chatId = msg.chat.id;
  const resp = match[1];

  return Observable.of({ text: resp });
};
