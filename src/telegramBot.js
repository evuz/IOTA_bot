const TelegramBot = require('node-telegram-bot-api');
const api = require('./api');
const convert = require('./convert');
const validate = require('./validate');
const notifications = require('./notifications');
const format = require('./format');
const ModelUser = require('./db/user');
const ModelChat = require('./db/chat');

function MyTelegramBot(config) {
  const token = config.token;
  const bot = new TelegramBot(token, { polling: true });
  const notificationsActive = {};
  let myID;

  init();

  function init() {
    bot.getMe()
      .then(res => myID = res.id);
    runMessageUpdate();
    runNotifications();
  }

  bot.onText(/\/start/, (msg) => {
    if (isGroup(msg.chat.type)) return;
    const chat = msg.chat;
    const user = msg.from;

    ModelUser.newUser(user);
    ModelChat.newChat(chat);
    ModelChat.addMemberToChat(chat.id, user.id);
    bot.sendMessage(chat.id,
      'Welcome!\n' +
      'Use /help to show the commands list');
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    let message =
      '/infoIOTA - Show IOTA price \n' +
      '/infoUser - Show IOTA value of user \n' +
      '/setIOTA - Set your IOTAs number \n' +
      '/setInvestment - Set your investment \n' +
      '/setCurrency - Set your currency \n' +
      '/setAlias - Set your name'

    if (isGroup(msg.chat.type))
      message +=
        '\n/helloBot - Say hi to me!' +
        '\n/infoUpdate (min)- Send a info message it will be update automatically';

    bot.sendMessage(chatId, message);
  });

  bot.onText(/\/infoIOTA/, async (msg) => {
    const chatId = msg.chat.id;

    const opts = createInlineKeyboard(['Update'], 'infoIOTA');
    const message = await getInfoIOTA();

    bot.sendMessage(chatId, message, opts);
  });

  bot.onText(/\/infoUser/, async (msg) => {
    const chat = msg.chat;
    const opts = Object.assign({}, { parse_mode: 'markdown' },
      createInlineKeyboard(['Update'], 'infoUser'))

    bot.sendMessage(chat.id, await getInfoUser(chat), opts);
  });

  bot.onText(/\/infoUpdate (.+)/, async (msg, match) => {
    const chat = msg.chat;
    const value = match[1];

    setInfoUpdate(chat, value);
  });

  bot.onText(/\/setIOTA (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const iotas = match[1];
    if (!validate.isNumber(iotas)) return bot.sendMessage(chatId,
      'You must introduce a correct number'
    );
    const user = ModelUser.setIOTA(userId, parseInt(iotas));

    if (user.error) return bot.sendMessage(chatId, user.error);
    bot.sendMessage(chatId, 'Save!');
  });

  bot.onText(/\/setIOTA$/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Introduce a value, for example: \n' +
      '/setIOTA 250'
    );
  });

  bot.onText(/\/setInvestment (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const value = match[1];
    if (!validate.isNumber(value)) return bot.sendMessage(chatId,
      'You must introduce a correct number'
    );

    const user = ModelUser.setInvestment(userId, parseInt(value));
    if (user.error) return bot.sendMessage(chatId, user.error);
    bot.sendMessage(chatId, 'Save!');
  });

  bot.onText(/\/setInvestment$/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Introduce a value, for example: \n' +
      '/setInvestment 100'
    );
  });

  bot.onText(/\/setCurrency (.+)/, (msg, match) => {
    const chat = msg.chat;
    const userId = msg.from.id;

    const value = match[1];

    let user;
    if (isGroup(chat.type)) user = ModelChat.setCurrency(chat.id, value);
    else user = ModelUser.setCurrency(userId, value);
    if (user.error) return bot.sendMessage(chat.id, user.error);
    bot.sendMessage(chat.id, 'Save!');
  });

  bot.onText(/\/setCurrency$/, (msg) => {
    const chatId = msg.chat.id;

    const opts = createInlineKeyboard(['EUR', 'USD'], 'setCurrency');
    bot.sendMessage(chatId, 'Select your currency', opts);
  });

  bot.onText(/\/setAlias (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1];
    const userId = msg.from.id;

    ModelUser.setName(userId, value);
    bot.sendMessage(chatId, 'Save!');
  });

  bot.onText(/\/setAlias$/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Introduce a value, for example: \n' +
      '/setAlias IotaBot'
    );
  });

  bot.onText(/\/helloBot/, async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    const chatType = msg.chat.type;
    if (!isGroup(chatType)) return;
    ModelUser.newUser(user);
    const res = ModelChat.addMemberToChat(chatId, user.id);

    if (res.error) return bot.sendMessage(chatId, res.error);
    bot.sendMessage(chatId, `Hello ${user.first_name || user.id}! \n` +
      `I know ` +
      `${ModelChat.getMemberCount(chatId).members}/${(await bot.getChatMembersCount(chatId)) - 1} members`
    );
  });

  bot.onText(/\/notifications/, (msg) => {
    const chatId = msg.chat.id;

    setNotification(chatId);
  })

  bot.on('message', (msg) => {
    const chat = msg.chat;
    const { left_chat_member, new_chat_member } = msg;
    if (left_chat_member) leftChatMember(chat, left_chat_member);
    if (new_chat_member) newChatMember(chat, new_chat_member);
  })

  bot.on('callback_query', async (callbackQuery) => {
    const chat = callbackQuery.message.chat;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data.split(' ');
    const [command, value] = data;

    const opts = {
      chat_id: chat.id,
      message_id: callbackQuery.message.message_id
    };

    switch (command) {
      case 'setCurrency': {
        let user;
        if (isGroup(chat.type)) user = ModelChat.setCurrency(chat.id, value);
        else user = ModelUser.setCurrency(userId, value);
        if (user.error) return bot.editMessageText(user.error, opts);
        bot.editMessageText(`${value} selected`, opts);
        break;
      }
      case 'infoIOTA': {
        bot.editMessageText('Updating...', opts);
        const newOpts = Object.assign({}, opts, createInlineKeyboard(['Update'], 'infoIOTA'));
        bot.editMessageText(await getInfoIOTA(), newOpts);
        break;
      }
      case 'infoUser': {
        bot.editMessageText('Updating...', opts);
        const newOpts = Object.assign({}, opts, { parse_mode: 'markdown' },
          createInlineKeyboard(['Update'], 'infoUser'))
        bot.editMessageText(await getInfoUser(chat), newOpts);
        break;
      }
      default:
        break;
    }
  })

  function newChatMember(chat, member) {
    if (!isGroup(chat.type)) return;

    const chatId = chat.id;
    if (member.id === myID) {
      ModelChat.newChat(chat);
      return bot.sendMessage(chatId, 'Hi! I don\'t know you.' +
        'Please introduce yourself using the command /helloBot'
      );
    }
    ModelUser.newUser(member);
    const res = ModelChat.addMemberToChat(chatId, member.id);
    if (res.error) return bot.sendMessage(chatId, res.error);
    bot.sendMessage(chatId, `Hello ${member.first_name || member.id}!`);
  }

  function leftChatMember(chat, member) {
    if (!isGroup(chat.type)) return;

    const chatId = chat.id;
    ModelChat.leftMemberToChat(chatId, member.id)
  }

  async function getInfoUser(chat) {
    const { error, members } = ModelChat.getMembers(chat.id);

    if (error) return bot.sendMessage(chat.id, error);

    let type;
    if (isGroup(chat.type)) type = ModelChat.getCurrency(chat.id);

    const message = await getMessageInfoUsers(members, type);
    return message;
  }

  async function getMessageInfoUsers(members, type) {
    const { timestamp, price } = await api.getIOTAPrice();
    const { USD } = await convert.getRates();
    const date = new Date(timestamp * 1000).toLocaleTimeString('es-ES');
    members = members.map((member) => {
      const user = ModelUser.getIOTAValue(parseInt(member), price);
      if (user.error)
        return null;

      const currency = type || user.currency;

      const profitFormat = currency === 'USD' ?
        user.profit.toFixed(2) :
        convert.convertTo(user.profit, 1 / USD);
      const actualProfit = profitFormat - user.inv;

      return {
        name: user.name || user.id,
        iotas: user.iotas,
        profit: profitFormat,
        currency,
        actualProfit
      };
    }).filter((member) => member)
      .sort((a, b) => b.actualProfit - a.actualProfit);

    const maxLengthProfit = members.reduce((max, member) => {
      const profitLength = Math.round(member.profit).toString().length;
      return profitLength > max ? profitLength : max;
    }, 0);

    const memberText = members.map((user) => {
      return format.paddingText(user.name, { size: 7, add: ':' }) +
        format.paddingText(user.iotas, { add: 'MI', align: 'right', size: 8 }) + ' ~ ' +
        format.paddingText(Math.round(user.profit), { size: maxLengthProfit + 1, add: convert.getSymbol(user.currency), align: 'right' }) +
        ` (${user.actualProfit < 0 ? '' : '+'}${user.actualProfit.toFixed(2)}${convert.getSymbol(user.currency)})`;
    }).join('\n');

    const msg =
      `IOTA price at ${date}:\n` +
      `${price}$ = ${(convert.convertTo(price, 1 / USD))}€\n\n` +
      memberText;

    return format.monospaceFormat(msg);
  }

  async function getInfoIOTA() {
    const { timestamp, price } = await api.getIOTAPrice();
    const date = new Date(timestamp * 1000).toLocaleTimeString('es-ES');

    const message = `IOTA price at ${date}:\n` +
      `${price}$ = ${(await convert.USDtoEUR(price)).toFixed(4)}€`

    return message;
  }

  async function setNotification(chatId, silent) {
    const { processNotifications } = notifications();

    const myNotify = notificationsActive[chatId];

    if (myNotify) clearInterval(myNotify);

    ModelChat.setNotification(chatId, true);
    notificationsActive[chatId] = processNotifications(api.getIOTAPrice, (notify) => {
      bot.sendMessage(chatId, notify);
    });
    if (!silent) bot.sendMessage(chatId, 'Notifications enable');
  }

  async function setInfoUpdate(chat, minIntervalUpdate, messageId) {
    if (!validate.isNumber(minIntervalUpdate)) return bot.sendMessage(chat.id,
      'You must introduce a correct number'
    );

    const min = parseInt(minIntervalUpdate);
    if (min < 1) return bot.sendMessage(chat.id,
      'You must introduce a number greater than 0'
    );

    const { members, error } = ModelChat.getMembers(chat.id);
    if (error) return bot.sendMessage(chat.id, error);

    let type;
    if (isGroup(chat.type)) type = ModelChat.getCurrency(chat.id);

    let message = (await getMessageInfoUsers(members, type)) +
      format.monospaceFormat(`\nThis message will be updated every ${min} minutes`);
    if (!messageId) {
      bot.sendMessage(chat.id, message, { parse_mode: 'markdown' })
        .then(({ message_id }) => {
          messageId = message_id;
          ModelChat.setMessageId(chat.id, messageId);
          ModelChat.setUpdateInterval(chat.id, min);
        });
    }

    const intervalId = setInterval(async () => {
      const chatMessageId = ModelChat.getMessageId(chat.id).messageId;
      const opts = {
        message_id: ModelChat.getMessageId(chat.id).messageId,
        chat_id: chat.id,
        parse_mode: 'markdown'
      };

      if (chatMessageId == messageId) {
        bot.editMessageText('Updating...', opts);

        const { members } = ModelChat.getMembers(chat.id);
        const date = new Date().toLocaleTimeString('es-ES');
        let message = (await getMessageInfoUsers(members, type)) +
          format.monospaceFormat(`\nThat message will be updated every ${min} minutes ` +
            `\nLast update: ${date}`);
        bot.editMessageText(message, opts);
      } else {
        clearInterval(intervalId);
      }
    }, min * 60 * 1000);
  }

  function runMessageUpdate() {
    const chats = ModelChat.getChatsWithMessageId();
    chats.forEach((chat) => {
      setInfoUpdate({ id: chat.id, type: chat.type }, chat.minsUpdateInterval, chat.messageId);
    })
  }

  function runNotifications() {
    const chats = ModelChat.getChatsByNotification(true);
    chats.forEach((chat) => setNotification(chat.id, true));
  }

  function createInlineKeyboard(opts, command) {
    const buttons = Object.keys(opts).map((key) => {
      return {
        text: opts[key],
        callback_data: `${command} ${opts[key]}`
      }
    })
    return {
      reply_markup: {
        inline_keyboard: [buttons]
      }
    };
  }

  function isGroup(type) {
    if (type === 'group' || type === 'supergroup')
      return true;

    return false;
  }
}

module.exports = MyTelegramBot;
