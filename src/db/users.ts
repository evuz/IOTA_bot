import * as Loki from 'lokijs';
import { Collection } from 'lokijs';

import { IUser } from '../interfaces/User';

export class Users {
  private users: Collection<IUser>;

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

  public setIOTA(id, iotas) {
    let user = this.findUserById(id);
    if (user === null) {
      throw new Error('User not found, use /start to create the user');
    }
    user = Object.assign({}, user, { iotas });
    this.users.update(user);
    return user;
  }

  public setInvestment(id, investment) {
    let user = this.findUserById(id);
    if (user === null) {
      throw new Error('User not found, use /start to create the user');
    }
    user = Object.assign({}, user, { investment });
    this.users.update(user);
    return user;
  }

  public setName(id, name) {
    let user = this.findUserById(id);
    if (user === null) {
      throw new Error('User not found, use /start to create the user');
    }
    user = Object.assign({}, user, { name });
    this.users.update(user);
    return user;
  }

  public setCurrency(id: number, currency: string) {
    currency = currency.toUpperCase();
    if (currency !== 'USD' && currency !== 'EUR') throw new Error('Currency not supported yet, you can use USD or EUR');

    let user = this.findUserById(id);
    if (user === null) {
      throw new Error('User not found, use /start to create the user');
    }
    user = Object.assign({}, user, { currency });
    this.users.update(user);
    return user;
  }

  public getUser(id) {
    return this.findUserById(id);
  }

  private findUserById(id) {
    return this.users.findOne({ id });
  }
}
