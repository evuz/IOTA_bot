import { format } from 'date-fns';

export function generateInfoEurPrice(price, eurPrice, timestamp = Date.now()) {
    const date = format(timestamp * 1000, 'DD/MM/YYYY');
    const hour = format(timestamp * 1000, 'HH:mm:ss');
    return `IOTA price is from ${date} to ${hour}:\n` + `${(+price).toFixed(4)}$ = ${eurPrice.toFixed(4)}€`;
}
