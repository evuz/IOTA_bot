import * as Loki from 'lokijs';
import { Collection } from 'lokijs';

export class Chats {
  private chats: Collection;

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
    return this.chats.insert({ id, type, members: {} });
  }

  public addMemberToChat(chatId, userId) {
    const chat = this.findChatById(chatId);
    if (chat === null) {
        throw new Error('Chat not found');
    }
    chat.members = Object.assign({}, chat.members, { [userId]: true });
    this.chats.update(chat);
  }

  private findChatById(id) {
    return this.chats.findOne({ id });
  }
}
