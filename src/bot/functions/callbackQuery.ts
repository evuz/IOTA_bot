import { CallbackQuery } from 'node-telegram-bot-api';
import * as TelegramBot from 'node-telegram-bot-api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/zip';
import 'rxjs/add/observable/timer';

import { info } from './info';

export function onCallbackQuery(telegramBot: TelegramBot, callbackQuery: CallbackQuery) {
  const { message: { chat, message_id }, from: { id: userId }, id: callback_query_id } = callbackQuery;
  const [command, value] = callbackQuery.data.split(' ');

  const callbackOpts = {
    chat_id: chat.id,
    message_id: message_id,
  };

  switch (command) {
    case 'infoIOTA': {
      telegramBot.editMessageText('Updating...', callbackOpts);
      Observable.zip(info(), Observable.timer(200)).subscribe(([{ text, opts }]) => {
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
