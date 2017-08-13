const TelegramBot = require('node-telegram-bot-api');
const api = require('./api');
const convert = require('./convert');
const ModelUser = require('./db/user');

function MyTelegramBot(config) {
  const token = config.token;
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    ModelUser.newUser(userId);
    bot.sendMessage(chatId,
      'Welcome!\n' +
      'Use /help to show the commands list');
  });

  bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
      '/infoIOTA - Show IOTA price \n' +
      '/infoUser - Show IOTA value of user \n' +
      '/setIOTA - Set your IOTAs number \n' +
      '/setEUR - Set your investment'
    );
  });

  bot.onText(/\/infoIOTA/, async (msg) => {
    const chatId = msg.chat.id;

    const { timestamp, price } = await api.getIOTAPrice();
    const date = new Date(timestamp * 1000).toLocaleTimeString('es-ES');

    bot.sendMessage(chatId,
      `IOTA price at ${date}:\n` +
      `${price}$ = ${(await convert.USDtoEUR(price)).toFixed(4)}€`
    )
  });

  bot.onText(/\/infoUser/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;


    const { timestamp, price } = await api.getIOTAPrice();
    const user = ModelUser.getIOTAValue(userId, price);

    if (user.error)
      return bot.sendMessage(chatId, user.error);

    bot.sendMessage(chatId,
      `Your ${user.iotas} MI is worth ${(await convert.USDtoEUR(user.eur)).toFixed(2)}€`
    )
  });

  bot.onText(/\/setIOTA (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const iotas = match[1];
    ModelUser.setIOTA(userId, iotas);
    bot.sendMessage(chatId, 'Save!');
  });

  bot.onText(/\/setEUR (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const eur = match[1]; // the captured "whatever"

    ModelUser.setEUR(userId, eur);
    bot.sendMessage(chatId, 'Save!');
  });
}

module.exports = MyTelegramBot;
