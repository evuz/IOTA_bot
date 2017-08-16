const loki = require('lokijs');
function createDB(name) {
  return new Promise((resolve) => {
    const db = new loki(name, {
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
