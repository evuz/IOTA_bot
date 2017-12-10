import * as Loki from 'lokijs';
import { Observable } from 'rxjs/Observable';

export function createDB(name: string): Observable<Loki> {
  return Observable.create(obs => {
    const db = new Loki(name, {
      autoload: true,
      autoloadCallback: () => {
          obs.next();
      },
      autosave: true,
      autosaveInterval: 1000,
    });
  });
}
