export function getRelatedObjectName(relatedObject) {
  let relatedObjectName;
  switch (relatedObject.collection) {
  case 'persons':
    relatedObjectName = `${relatedObject.firstName} ${relatedObject.lastName}`.trim();
    break;
  case 'structures':
    relatedObjectName = relatedObject.currentName.usualName;
    break;
  case 'prices':
    relatedObjectName = relatedObject.nameFr;
    break;
  case 'projects':
    relatedObjectName = relatedObject.nameFr;
    break;
  case 'legal-categories':
    relatedObjectName = relatedObject.longNameFr;
    break;
  case 'official-texts':
    relatedObjectName = relatedObject.title;
    break;
  default:
    relatedObjectName = relatedObject.usualNameFr;
    break;
  }
  return relatedObjectName;
}

export function getRelatedObjectUrl(relatedObject) {
  let url;
  switch (relatedObject.type) {
  case 'person':
    url = `/persons/${relatedObject.id}`;
    break;
  case 'legal-category':
    url = `/categories-juridiques/${relatedObject.id}`;
    break;
  case 'category':
    url = `/categories/${relatedObject.id}`;
    break;
  case 'structure':
    url = `/structures/${relatedObject.id}`;
    break;
  case 'price':
    url = `/prices/${relatedObject.id}`;
    break;
  case 'project':
    url = `/projects/${relatedObject.id}`;
    break;
  case 'term':
    url = `/terms/${relatedObject.id}`;
    break;
  default:
    url = '/';
    break;
  }
  return url;
}

export function parseRelatedObject(relatedObject) {
  return {
    id: relatedObject.id,
    name: getRelatedObjectName(relatedObject),
    url: getRelatedObjectUrl(relatedObject),
    type: relatedObject.collection,
  };
}

export function parseRelatedElement(data) {
  if (!data.id) return {};
  const {
    relatedObject,
    relationType,
    resource,
    startDateOfficialText,
    endDateOfficialText,
  } = data;
  return ({
    ...data,
    resourceName: resource.displayName,
    relatedObjectId: relatedObject?.id,
    relatedObjectName: relatedObject.displayName,
    relationTypeId: relationType?.id,
    relationTypeName: relationType?.name,
    startDateOfficialTextId: startDateOfficialText?.id,
    startDateOfficialTextName: startDateOfficialText?.title,
    endDateOfficialTextId: endDateOfficialText?.id,
    endDateOfficialTextName: endDateOfficialText?.title,
  });
}
