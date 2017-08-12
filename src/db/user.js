let db;
let users;

function initCollection(newDB) {
  db = newDB;
  users = db.getCollection('users');
  if (users === null) {
    users = db.addCollection('users', { indices: ['id'] });
  }
}

function findUserById(id) {
  return users.findOne({ id });
}


function newUser(id) {
  const user = findUserById(id);
  if (user === null) {
    return users.insert({ id });
  }
  return user;
}

function setIOTA(id, iotas) {
  let user = findUserById(id);
  if (user === null) user = newUser(id);
  user = Object.assign({}, user, { iotas });
  users.update(user);
}

function setEUR(id, eur) {
  let user = findUserById(id);
  if (user === null) user = newUser(id);
  user = Object.assign({}, user, { eur });
  users.update(user);
}

module.exports = {
  initCollection,
  newUser,
  setIOTA,
  setEUR
}
