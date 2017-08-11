let db;
let users;

function initCollection(newDB) {
  db = newDB;
  users = db.getCollection('users');
  if (users === null) {
    users = db.addCollection('users', { indices: ['id'] });
  }
}

function newUser(id) {
  const user = users.findOne({ id });
  if (user === null) {
    users.insert({ id });
  }
}

module.exports = {
  initCollection,
  newUser
}
