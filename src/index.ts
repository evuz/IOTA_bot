import { Bot } from './bot';
import { addListeners } from './bot/functions';
import config from './config';

const bot = Bot(config);
addListeners(bot);
