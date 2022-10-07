/**
 *
 * @param number
 * @param precision
 * @returns {string}
 */
export default function cleanNumber(number, precision = 1) {
  let cleanedNumber;
  if (Math.abs(number) < 1000) {
    cleanedNumber = number.toLocaleString('fr-FR', { minimumFractionDigits: precision, maximumFractionDigits: precision });
  } else {
    const units = ['k', 'M', 'B', 'T', 'Q'];
    // eslint-disable-next-line no-loss-of-precision
    const unit = Math.floor((number / 1.0e1).toFixed(0).toString().length);
    const r = unit % 3;
    const x = Math.abs(Number(number)) / Number(`1.0e+${unit - r}`);
    cleanedNumber = `${number < 0 ? '-' : ''}${x.toLocaleString('fr-FR', { minimumFractionDigits: precision, maximumFractionDigits: precision })} ${
      units[Math.floor(unit / 3) - 1]
    }`;
  }
  return cleanedNumber;
}
