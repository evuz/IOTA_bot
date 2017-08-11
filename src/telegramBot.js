const TelegramBot = require('node-telegram-bot-api');
const api = require('./api');
const convert = require('./convert');

function MyTelegramBot(config) {
  const token = config.token;
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Bienvenido!');
  });

  bot.onText(/\/IOTAinfo/, (msg) => {
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

  bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;

    api.getIOTAPrice()
      .then(res => {
        const date = new Date(res.timestamp * 1000).toLocaleTimeString('es-ES');
        bot.sendMessage(chatId, `IOTA price at ${date}: ${res.price}`)
      });
  });

  bot.onText(/\/IOTAS (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp);
  });

  bot.onText(/\/deposit (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp);
  });
}

module.exports = MyTelegramBot;
