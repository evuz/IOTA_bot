const moment = require('moment');
const tz = require('moment-timezone'); // eslint-disable-line


function getZonesWith(str) {
  const zones = moment.tz.names();
  return zones.filter(zone => zone.includes(str));
}

function exist(timezone) {
  return moment.tz.names().includes(timezone);
}

function getDateFormat(time, timezone) {
  const date = moment.tz(time, timezone || 'Etc/GMT');
  return date.format("HH:mm:ss");
}

module.exports = {
  getZonesWith,
  exist,
  getDateFormat
}
