import { CallbackQuery } from 'node-telegram-bot-api';
import * as TelegramBot from 'node-telegram-bot-api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/zip';
import 'rxjs/add/observable/timer';

import { info } from './info';
import { myInfo } from './myInfo';

export function onCallbackQuery(telegramBot: TelegramBot, callbackQuery: CallbackQuery) {
  const { message: { chat, message_id }, from: { id: userId }, id: callback_query_id } = callbackQuery;
  const [command, value] = callbackQuery.data.split(' ');
  const callbackOpts = {
    chat_id: chat.id,
    message_id: message_id,
  };
  const msg = { from: { id: userId }, chat: { id: chat.id } };

  switch (command) {
    case 'infoIOTA': {
      telegramBot.editMessageText('Updating...', callbackOpts);
      Observable.zip(info({ msg }), Observable.timer(200)).subscribe(([{ text, opts }]) => {
        telegramBot.editMessageText(text, Object.assign({}, callbackOpts, opts));
      });
      break;
    }
    case 'myInfo': {
      telegramBot.editMessageText('Updating...', callbackOpts);
      Observable.zip(myInfo({ msg }), Observable.timer(200)).subscribe(([{ text, opts }]) => {
        telegramBot.editMessageText(text, Object.assign({}, callbackOpts, opts));
      });
      break;
    }
    default:
      break;
  }
  telegramBot.answerCallbackQuery({
    callback_query_id,
    show_alert: false,
  });
}
