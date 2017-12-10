import * as TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../../interfaces/TelegramMessage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ITelegramSendMessage } from '../../interfaces/TelegramSendMessage';
import { isGroup } from '../utils/isGroup';
import { users, chats } from '../../db/index';

export const start = ({
  msg,
}: ITelegramMessage): Observable<ITelegramSendMessage> => {
  if (isGroup(msg.chat.type)) return;
  const chat = msg.chat;
  const user = msg.from;

  try {
    users.newUser(user);
    chats.newChat(chat);
    chats.addMemberToChat(chat.id, user.id);
    return Observable.of({
      text: 'Welcome!\n' + 'Use /help to show the commands list',
    });
  } catch (err) {
    return Observable.of({
      text: `Hello ${user.first_name}!`,
    });
  }
};
