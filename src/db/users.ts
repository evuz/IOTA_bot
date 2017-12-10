import * as Loki from 'lokijs';
import { Collection } from 'lokijs';

export class Users {
  private users: Collection;

  constructor(db: Loki) {
    this.users = db.getCollection('users');
    if (this.users === null) {
      this.users = db.addCollection('users', { indices: ['id'] });
    }
  }

  public newUser({ id, first_name }) {
    const user = this.findUserById(id);
    if (user !== null) {
      throw new Error('User already exist');
    }
    return this.users.insert({ id, name: first_name });
  }

  private findUserById(id) {
    return this.users.findOne({ id });
  }
}
