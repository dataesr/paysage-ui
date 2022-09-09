const URLTypesMapper = [
  ['structures', 'structures'],
  ['personnes', 'persons'],
  ['categories', 'categories'],
  ['prix', 'prices'],
  ['textes-officiels', 'official-texts'],
  ['projets', 'projects'],
  ['termes', 'terms'],
];

export function getTypeFromUrl(type) {
  return URLTypesMapper.filter((elem) => elem.includes(type))?.[0]?.[1];
}

export function getUrlFromType(url) {
  return URLTypesMapper.filter((elem) => elem.includes(url))?.[0]?.[0];
}
