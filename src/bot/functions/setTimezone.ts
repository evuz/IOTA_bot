import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';
import { isGroup } from '../utils/isGroup';
import { isNumber } from '../../utils/isNumber';
import { chats } from '../../db/index';

export const setTimezone = ({ msg, match }: ITelegramMessage): Observable<ITelegramSendMessage> => {
  if (isGroup(msg.chat.type)) {
    return Observable.of({
      text: `This action only is available in a private chat`,
    });
  }

  try {
    const chatId = msg.chat.id;
    const time = match[1].split(':');

    const formatError = time.filter(el => !isNumber(el) || el.length > 2);
    if (formatError.length || time.length !== 2) return Observable.of({ text: 'Error this format HH:mm' });

    const now = new Date();
    now.setHours(now.getUTCHours());
    const userHour = new Date();
    userHour.setHours(+time[0]);
    const timezone = (now.getTime() - userHour.getTime()) / (60 * 1000);
    chats.setTimezone(chatId, timezone);
    return Observable.of({ text: `Set timezone: GMT${timezone > 0 ? '' : '+'}${-timezone / 60}` });
  } catch (err) {
    return Observable.of({
      text: `${err}!`,
    });
  }
};
