import { Bot } from './bot';
import { createDB } from './db';
import { addListeners } from './bot/functions';
import config from './config';
import './services';

createDB('IOTA.db').subscribe(() => {
  const bot = Bot(config);
  addListeners(bot);
});
