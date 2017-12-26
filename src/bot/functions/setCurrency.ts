import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';
import { isGroup } from '../utils/isGroup';
import { users } from '../../db/index';

export const setCurrency = ({ msg, match }: ITelegramMessage): Observable<ITelegramSendMessage> => {
  if (isGroup(msg.chat.type)) {
    return Observable.of({
      text: `This action only is available in a private chat`,
    });
  }

  try {
    const userId = msg.from.id;
    const currency = match[1];

    users.setCurrency(userId, currency);
    return Observable.of({ text: 'Save!' });
  } catch (err) {
    return Observable.of({
      text: `${err}!`,
    });
  }
};
