export function capitalize(str) {
  const string = `${str}`;
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}
