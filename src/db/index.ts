import * as Loki from 'lokijs';
import { Observable } from 'rxjs/Observable';

import { Chats } from './chats';
import { Users } from './users';

export let chats: Chats;
export let users: Users;

export function createDB(name: string): Observable<Loki> {
  return Observable.create(obs => {
    const db = new Loki(name, {
      autoload: true,
      autoloadCallback: () => {
          chats = new Chats(db);
          users = new Users(db);
          obs.next();
      },
      autosave: true,
      autosaveInterval: 1000,
    });
  });
}
