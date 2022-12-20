const URLTypesMapper = [
  ['categories', 'categories'],
  ['categories-juridiques', 'legal-categories'],
  ['personnes', 'persons'],
  ['prix', 'prizes'],
  ['projets', 'projects'],
  ['structures', 'structures'],
  ['termes', 'terms'],
  ['textes-officiels', 'official-texts'],
  ['ministres-de-tutelle', 'supervising-ministers'],
  ['utilisateurs', 'users'],
];

export function getTypeFromUrl(type) {
  return URLTypesMapper.filter((elem) => elem.includes(type))?.[0]?.[1];
}

export function getUrlFromType(url) {
  return URLTypesMapper.filter((elem) => elem.includes(url))?.[0]?.[0];
}
