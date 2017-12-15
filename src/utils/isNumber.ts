export function isNumber(value: string) {
  const number = parseInt(value);
  return !isNaN(number);
}
