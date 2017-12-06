import { TelegramBotStub, msgMock as msg } from '../telegramBotStub';
import { echo } from '../../../src/bot/functions/echo';

describe('Echo function', () => {
  const telegramBot: any = new TelegramBotStub();

  it('Test function', done => {
    const rgx = /\/echo (.+)/;
    const match = rgx.exec('/echo test echo');
    telegramBot.listener.subscribe(res => {
      expect(res).toEqual('test echo');
      done();
    });
    echo(telegramBot, { msg, match });
  });
});
