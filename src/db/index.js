const loki = require('lokijs');
function createDB(name) {
  return new Promise((resolve) => {
    var db = new loki('IOTA.db', {
      autoload: true,
      autoloadCallback: () => resolve(db),
      autosave: true,
      autosaveInterval: 1000
    });
  })
}

module.exports = {
  createDB
}
