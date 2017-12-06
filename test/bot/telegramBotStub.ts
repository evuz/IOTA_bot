import { Subject } from 'rxjs/Subject';

export class TelegramBotStub {
  public listener = new Subject();

  sendMessage(chatId: string, msg: string) {
    this.listener.next(msg);
  }
}

export const msgMock = {
  message_id: 1,
  date: 1512584416447,
  chat: {
    id: 2,
    type: 'private'
  }
};
