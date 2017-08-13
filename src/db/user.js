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

function getIOTAValue(id, priceIOTA) {
  const user = findUserById(id);
  if (user !== null) {
    if (!user.iotas || !user.investment)
      return { error: 'User doesn\'t set his data' };

    return {
      profit: user.iotas * priceIOTA,
      iotas: user.iotas,
      currency: user.currency || 'USD'
    }
  }
}

function setIOTA(id, iotas) {
  let user = findUserById(id);
  if (user === null) user = newUser(id);
  user = Object.assign({}, user, { iotas });
  users.update(user);
}

function setInvestment(id, investment) {
  let user = findUserById(id);
  if (user === null) user = newUser(id);
  user = Object.assign({}, user, { investment });
  users.update(user);
}

function setCurrency(id, currency) {
  if (currency !== 'USD' && currency !== 'EUR')
    return { error: 'Currency not supported yet, you can use USD or EUR' }

  let user = findUserById(id);
  if (user === null) user = newUser(id);
  user = Object.assign({}, user, { currency });
  users.update(user);
  return { status: 'success' }
}

module.exports = {
  initCollection,
  newUser,
  setIOTA,
  setInvestment,
  setCurrency,
  getIOTAValue
}
