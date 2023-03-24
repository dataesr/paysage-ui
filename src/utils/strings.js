export function capitalize(str) {
  const string = `${str}`;
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

export function normalize(string) {
  return string
    .normalize('NFD')
    .replace(/[\p{S}\p{M}\p{Zl}]/gu, '')
    .replace(/[\p{P}]/gu, ' ')
    .replace(/  +/g, ' ')
    .toLowerCase()
    .trim();
}
