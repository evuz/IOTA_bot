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

function newUser({ id, first_name }) {
  const user = findUserById(id);
  if (user === null) {
    return users.insert({ id, name: first_name });
  }
  return user;
}

function getIOTAValue(id, priceIOTA) {
  const user = findUserById(id);
  if (user !== null) {
    if (!user.iotas || !user.investment)
      return { error: 'User doesn\'t set his data' };
    return {
      name: user.name,
      profit: user.iotas * priceIOTA,
      inv: user.investment,
      iotas: user.iotas,
      timezone: user.timezone,
      currency: user.currency || 'USD'
    }
  }
  return { error: 'User not found' };
}

function setIOTA(id, iotas) {
  let user = findUserById(id);
  if (user === null) return { error: 'User not found, use /start to create the user' }
  user = Object.assign({}, user, { iotas });
  users.update(user);
  return { status: 'success' }
}

function setInvestment(id, investment) {
  let user = findUserById(id);
  if (user === null) return { error: 'User not found, use /start to create the user' }
  user = Object.assign({}, user, { investment });
  users.update(user);
  return { status: 'success' }
}

function setName(id, name) {
  let user = findUserById(id);
  if (user === null) return { error: 'User not found, use /start to create the user' }
  user = Object.assign({}, user, { name });
  users.update(user);
  return { status: 'success' }
}

function setCurrency(id, currency) {
  if (currency !== 'USD' && currency !== 'EUR')
    return { error: 'Currency not supported yet, you can use USD or EUR' }

  let user = findUserById(id);
  if (user === null) return { error: 'User not found, use /start to create the user' }
  user = Object.assign({}, user, { currency });
  users.update(user);
  return { status: 'success' }
}

function setTimezone(userId, timezone) {
  const user = findUserById(userId);
  if (user !== null) {
    const newuser = Object.assign({}, user, { timezone });
    users.update(newuser);
    return { status: 'success' };
  }
  return { error: 'user not found' };
}

function getTimezone(userId) {
  const user = findUserById(userId);
  if (user === null) return { error: 'user not found' };
  const { timezone } = user;
  return { timezone: timezone || 'Etc/GMT' };
}

module.exports = {
  initCollection,
  newUser,
  setIOTA,
  setInvestment,
  setCurrency,
  setName,
  getIOTAValue,
  setTimezone,
  getTimezone
}
