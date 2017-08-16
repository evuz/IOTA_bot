const telegramBot = require('./telegramBot');
const config = require('../config');
const ModelDB = require('./db');
const ModelUser = require('./db/user');
const ModelChat = require('./db/chat');

const db = ModelDB.createDB('IOTA.db')
  .then(db => {
    ModelChat.initCollection(db);
    ModelUser.initCollection(db);
    telegramBot(config);
  });
