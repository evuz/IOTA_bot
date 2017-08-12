const TelegramBot = require('node-telegram-bot-api');
const api = require('./api');
const convert = require('./convert');
const ModelUser = require('./db/user');

function MyTelegramBot(config) {
  const token = config.token;
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    ModelUser.newUser(chatId);
    bot.sendMessage(chatId,
      'Welcome!\n' +
      'Use /help to show the commands list');
  });

  bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
      '/infoIOTA - Show IOTA price \n' +
      '/infoUser - Show IOTA value of user \n' +
      '/setIOTAS - Set your IOTAs number' +
      '/setEUR - Set your investment'
    );
  });

  bot.onText(/\/infoIOTA/, (msg) => {
    const chatId = msg.chat.id;

    api.getIOTAPrice()
      .then(async ({ timestamp, price }) => {
        const date = new Date(timestamp * 1000).toLocaleTimeString('es-ES');
        bot.sendMessage(chatId,
          `IOTA price at ${date}:\n` +
          `${price}$ = ${(await convert.USDtoEUR(price)).toFixed(4)}€`
        )
      });
  });

  bot.onText(/\/infoUser/, (msg) => {
    const chatId = msg.chat.id;

    api.getIOTAPrice()
      .then(res => {
        const date = new Date(res.timestamp * 1000).toLocaleTimeString('es-ES');
        bot.sendMessage(chatId, `IOTA price at ${date}: ${res.price}`)
      });
  });

  bot.onText(/\/setIOTA (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const iotas = match[1];
    ModelUser.setIOTA(chatId, iotas);
    bot.sendMessage(chatId, 'Save!');
  });

  bot.onText(/\/setEUR (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const eur = match[1]; // the captured "whatever"

    ModelUser.setEUR(chatId, eur);

    bot.sendMessage(chatId, 'Save!');
  });
}

module.exports = MyTelegramBot;
