import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';
import { isGroup } from '../utils/isGroup';
import { isNumber } from '../../utils/isNumber';
import { users } from '../../db/index';

export const setIota = ({ msg, match }: ITelegramMessage): Observable<ITelegramSendMessage> => {
  if (isGroup(msg.chat.type)) {
    return Observable.of({
      text: `This action only is available in a private chat`,
    });
  }

  try {
    const userId = msg.from.id;
    const iotas = match[1];
    if (!isNumber(iotas)) return Observable.of({ text: 'You must introduce a correct number' });
    users.setIOTA(userId, parseInt(iotas));
    return Observable.of({ text: 'Save!' });
  } catch (err) {
    return Observable.of({
      text: `${err}!`,
    });
  }
};
