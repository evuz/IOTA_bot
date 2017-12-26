import { format } from 'date-fns';

export function generateInfoEurPrice(price, eurPrice, { timestamp = Date.now(), timezoneOffset = 0 }: Hour) {
  const d = new Date(timestamp * 1000);
  d.setHours(d.getUTCHours());
  d.setMinutes(d.getMinutes() - timezoneOffset);
  const date = format(d, 'DD/MM/YYYY');
  const hour = format(d, 'HH:mm:ss');
  return `IOTA price is from ${date} to ${hour}:\n` + `${(+price).toFixed(4)}$ = ${eurPrice.toFixed(4)}€`;
}

interface Hour {
  timestamp?: number;
  timezoneOffset?: number;
}
