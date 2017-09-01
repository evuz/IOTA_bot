const moment = require('moment');
const tzwhere = require('tzwhere');
const tz = require('moment-timezone'); // eslint-disable-line

tzwhere.init()

function getZonesWith(str) {
  const zones = moment.tz.names();
  return zones.filter(zone => zone.includes(str));
}

function exist(timezone) {
  return moment.tz.names().includes(timezone);
}

function getDateFormat(time, timezone) {
  const date = moment.tz(time, timezone || 'Etc/GMT');
  return date.format("hh:mm:ss a");
}

function getTimezoneToCoordinates(lat, long) {
  return tzwhere.tzNameAt(lat, long);
}

module.exports = {
  getZonesWith,
  exist,
  getDateFormat,
  getTimezoneToCoordinates
}
