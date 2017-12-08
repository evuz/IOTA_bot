import { Bot } from './bot';
import { addListeners } from './bot/functions';
import config from './config';
import './services';

const bot = Bot(config);
addListeners(bot);
