const telegramBot = require('./telegramBot');
const config = require('../config');
const ModelDB = require('./db');
const ModelUser = require('./db/user');

const db = ModelDB.createDB('IOTA.db')
  .then(db => {
    ModelUser.initCollection(db);
    telegramBot(config);
  });
