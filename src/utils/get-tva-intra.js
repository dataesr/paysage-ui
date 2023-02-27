export function getTvaIntraFromSiren(siren) {
  return `FR${(12 + 3 * (siren.split(' ').join('') % 97)) % 97}${siren}`;
}
