import { paddingText } from './format/paddingText';
import { IUser } from './../../interfaces/User';

export function generateInfoUser(user: IUser, price: number, { maxLengthProfit = 4, currency = '$' }: Options) {
  if (user.iotas === undefined) throw new Error("IOTAs don't found");
  if (user.investment === undefined) throw new Error("Investment don't found");
  const profit = user.iotas * price;
  const actualProfit = profit - user.investment;
  return (
    paddingText(user.name, { size: 7, add: ':' }) +
    paddingText(user.iotas, { add: 'MI', align: 'right', size: 8 }) +
    ' ~ ' +
    paddingText(Math.round(profit), { size: maxLengthProfit + 1, add: '$', align: 'right' }) +
    ` (${actualProfit < 0 ? '' : '+'}${actualProfit.toFixed(2)}${currency})`
  );
}

interface Options {
  maxLengthProfit?: number;
  currency?: string;
}
