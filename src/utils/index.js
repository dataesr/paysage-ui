function getEnumKey(apiObject, apiSubObject) {
  let enumKey = '';
  if (apiSubObject === 'weblinks') {
    if (apiObject === 'structures') enumKey = 'StructureWeblinkTypesEnum';
    if (apiObject === 'persons') enumKey = 'PersonWeblinkTypesEnum';
    if (apiObject === 'projects') enumKey = 'ProjectWeblinkTypesEnum';
    if (apiObject === 'categories') enumKey = 'CategoryWeblinkTypesEnum';
  }

  if (apiSubObject === 'identifiers') {
    if (apiObject === 'structures') enumKey = 'StructureIdentifierTypesEnum';
    if (apiObject === 'persons') enumKey = 'PersonIdentifierTypesEnum';
    if (apiObject === 'projects') enumKey = 'ProjectIdentifierTypesEnum';
    if (apiObject === 'categories') enumKey = 'CategoryIdentifierTypesEnum';
  }

  if (apiSubObject === 'social-medias') {
    enumKey = 'SocialmediaTypesEnum';
  }

  return enumKey;
}

function getRoute(apiObject) {
  switch (apiObject) {
  case 'persons':
    return 'personnes';
  case 'terms':
    return 'termes';
  case 'projects':
    return 'projets';
  case 'official-texts':
    return 'textes-officiels';

  default:
    return apiObject;
  }
}

export { getEnumKey, getRoute };
