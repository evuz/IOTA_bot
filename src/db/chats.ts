import * as Loki from 'lokijs';
import { Collection } from 'lokijs';

import { IChat } from './../interfaces/Chat';

export class Chats {
  private chats: Collection<IChat>;

  constructor(db: Loki) {
    this.chats = db.getCollection('chats');
    if (this.chats === null) {
      this.chats = db.addCollection('chats', { indices: ['id'] });
    }
  }

  public newChat({ id, type }) {
    const chat = this.findChatById(id);
    if (chat !== null) {
      throw new Error('Chat already exist');
    }
    return this.chats.insert({ id, type, members: new Map<number, boolean>() });
  }

  public addMemberToChat(chatId, userId) {
    const chat: IChat = this.findChatById(chatId);
    if (chat === null) {
      throw new Error('Chat not found');
    }
    chat.members.set(userId, true);
    this.chats.update(chat);
  }

  private findChatById(id) {
    return this.chats.findOne({ id });
  }
}
