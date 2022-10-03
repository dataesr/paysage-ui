export function getRelatedObjectName(relatedObject) {
  let relatedObjectName;
  switch (relatedObject.type) {
  case 'person':
    relatedObjectName = `${relatedObject.firstName} ${relatedObject.lastName}`.trim();
    break;
  case 'structure':
    relatedObjectName = relatedObject.currentName.usualName;
    break;
  case 'price':
    relatedObjectName = relatedObject.nameFr;
    break;
  case 'project':
    relatedObjectName = relatedObject.nameFr;
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
    type: relatedObject.type,
  };
}

export function parseRelatedElement(data) {
  if (!data.id) return {};
  const {
    relatedObject,
    relationType,
    startDate,
    endDate,
    startDateOfficialText,
    endDateOfficialText,
  } = data;
  return ({
    startDate,
    endDate,
    relationTypeId: relationType?.id,
    relationTypeName: relationType?.name,
    relatedObjectName: getRelatedObjectName(relatedObject),
    relatedObjectId: data.relatedObject?.id,
    startDateOfficialTextId: startDateOfficialText?.id,
    startDateOfficialTextName: startDateOfficialText?.title,
    endDateOfficialTextId: endDateOfficialText?.id,
    endDateOfficialTextName: endDateOfficialText?.title,
  });
}
