function isNumber(value) {
  const number = parseInt(value);
  return !isNaN(number);
}

module.exports = {
  isNumber
}
