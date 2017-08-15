let db;
let chats;

function initCollection(newDB) {
  db = newDB;
  chats = db.getCollection('chats');
  if (chats === null) {
    chats = db.addCollection('chats', { indices: ['id'] });
  }
}

function findChatById(id) {
  return chats.findOne({ id });
}

function newChat(id) {
  const chat = findChatById(id);
  if (chat === null) {
    return chats.insert({ id, members: {} });
  }
  return chat;
}

function addMemberToChat(chatId, userId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    chat.members = Object.assign({}, chat.members, { [userId]: true });
    chats.update(chat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function addMessageId(chatId, messageId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const newChat = Object.assign({}, chat, { messageId });
    chats.update(newChat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function getMessageId(chatId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    return { messageId: chat.messageId };
  }
  return { error: 'Chat not found' };
}

function leftMemberToChat(chatId, userId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    chat.members = Object.assign({}, chat.members, { [userId]: false });
    chats.update(chat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function getMemberCount(chatId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const { members } = chat;
    const membersFiltered = Object.keys(members)
      .filter(key => members[key] === true);
    return { members: membersFiltered.length }
  }
  return { error: 'Chat not found' };
}

function getMembers(chatId) {
  const chat = findChatById(chatId);
  if (chat === null) return { error: 'Chat not found' };
  const { members } = chat;
  const membersFiltered = Object.keys(members)
    .filter(key => members[key] === true);
  return { members: membersFiltered };
}

module.exports = {
  initCollection,
  newChat,
  addMemberToChat,
  addMessageId,
  getMessageId,
  leftMemberToChat,
  getMemberCount,
  getMembers
}
