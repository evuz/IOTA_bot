import { SendBasicOptions } from 'node-telegram-bot-api';

import { IButtonInlineKeyboard } from '../../interfaces/IButtonInlineKeyboard';

export function createInlineKeyboard(
  opts: IButtonInlineKeyboard[],
  command: string,
): SendBasicOptions {
  const buttons = opts.map(key => {
    return [
      {
        text: key.text,
        callback_data: `${command} ${key.info || key.text}`,
      },
    ];
  });
  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
}
