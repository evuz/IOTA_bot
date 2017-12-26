import { Collection } from 'lokijs';

export interface IUser {
  id: number;
  name: string;
  iotas?: number;
  investment?: number;
}
