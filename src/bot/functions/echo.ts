import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export const echo = ({ msg, match }: ITelegramMessage): Observable<string> => {
  const chatId = msg.chat.id;
  const resp = match[1];

  return Observable.of(resp);
};
