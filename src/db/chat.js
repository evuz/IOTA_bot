let db;
let chats;

function initCollection(newDB) {
  db = newDB;
  chats = db.getCollection('chats');
  if (chats === null) {
    chats = db.addCollection('chats', { indices: ['id'] });
  }
}

function getChatsByNotification(notification) {
  return chats.find({ notification });
}

function getChatsWithMessageId() {
  const allChats = chats.find();
  return allChats.filter((chat) => chat.messageId);
}

function findChatById(id) {
  return chats.findOne({ id });
}

function newChat(newChat) {
  const { id, type } = newChat;
  const chat = findChatById(id);
  if (chat === null) {
    return chats.insert({ id, type, members: {} });
  }
  return chat;
}

function setCurrency(chatId, currency) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const newChat = Object.assign({}, chat, { currency });
    chats.update(newChat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function getCurrency(chatId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    return chat.currency || 'USD';
  }
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

function setMessageId(chatId, messageId) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const newChat = Object.assign({}, chat, { messageId });
    chats.update(newChat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function setUpdateInterval(chatId, minsUpdateInterval) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const newChat = Object.assign({}, chat, { minsUpdateInterval });
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

function setNotification(chatId, notification) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const newChat = Object.assign({}, chat, { notification });
    chats.update(newChat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function setTimezone(chatId, timezone) {
  const chat = findChatById(chatId);
  if (chat !== null) {
    const newChat = Object.assign({}, chat, { timezone });
    chats.update(newChat);
    return { status: 'success' };
  }
  return { error: 'Chat not found' };
}

function getTimezone(chatId) {
  const chat = findChatById(chatId);
  if (chat === null) return { error: 'Chat not found' };
  const { timezone } = chat;
  return { timezone: timezone || 'Etc/GMT' };
}

module.exports = {
  initCollection,
  getChatsByNotification,
  getChatsWithMessageId,
  newChat,
  setCurrency,
  getCurrency,
  addMemberToChat,
  setMessageId,
  setUpdateInterval,
  getMessageId,
  leftMemberToChat,
  getMemberCount,
  getMembers,
  setNotification,
  setTimezone,
  getTimezone
}
