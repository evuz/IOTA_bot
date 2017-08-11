let db;
let users;

function initCollection(newDB) {
  db = newDB;
  users = db.getCollection('users');
  if (users === null) {
    users = db.addCollection('users', { indices: ['id'] });
  }
}

module.exports = {
  initCollection
}
