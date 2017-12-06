import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';

import { TelegramBotStub, msgMock as msg } from '../telegramBotStub';
import { info } from '../../../src/bot/functions/info';
import {
  mockBitfinexRequestIotaTrades,
  mockFixerLatest
} from '../../services/apiMock';

describe('Info function', () => {
  const telegramBot: any = new TelegramBotStub();
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mockBitfinexRequestIotaTrades(mock);
    mockFixerLatest(mock);
  });

  it('Test function', done => {
    const rgx = /\/echo (.+)/;
    const match = rgx.exec('/info');
    telegramBot.listener.subscribe(res => {
      expect(res).toContain('IOTA price is from 06/12/2017 to 11:40:44');
      done();
    });
    info(telegramBot, { msg, match });
  });
});
