export default function parseRelatedElement(data) {
  if (!data.id) return {};
  const {
    relatedObject,
    relationType,
    startDate,
    endDate,
    startDateOfficialText,
    endDateOfficialText,
  } = data;
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
  return ({
    startDate,
    endDate,
    relationTypeId: relationType?.id,
    relationTypeName: relationType?.name,
    relatedObjectName,
    relatedObjectId: data.relatedObject?.id,
    startDateOfficialTextId: startDateOfficialText?.id,
    startDateOfficialTextName: startDateOfficialText?.title,
    endDateOfficialTextId: endDateOfficialText?.id,
    endDateOfficialTextName: endDateOfficialText?.title,
  });
}
