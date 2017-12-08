import { createInlineKeyboard } from '../../../src/bot/utils/createInlineKeyboard';

describe('CreateInlineKeyboard', () => {
  it('Test Function', () => {
    const buttons = [
      { text: 'Update' },
      { text: 'Upgrade', info: 'Upgrade info' },
    ];
    const keyboard = createInlineKeyboard(buttons, 'test');
    const response = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Update', callback_data: 'test Update' }],
          [{ text: 'Upgrade', callback_data: 'test Upgrade info' }],
        ],
      },
    };
    expect(keyboard).toEqual(response);
  });
});
