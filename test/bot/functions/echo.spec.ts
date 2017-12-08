import { msgMock as msg } from '../telegramBotStub';
import { echo } from '../../../src/bot/functions/echo';

describe('Echo function', () => {
  it('Test function', done => {
    const rgx = /\/echo (.+)/;
    const match = rgx.exec('/echo test echo');
    echo({ msg, match }).subscribe(res => {
      expect(res).toEqual('test echo');
      done();
    });
  });
});
