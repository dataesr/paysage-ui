export function getName(item) {
  return (
    <>
      {item?.shortName ? `${item.shortName} - ` : ''}
      {!item?.shortName && item?.acronymFr ? `${item.acronymFr} - ` : ''}
      {!item?.shortName && item?.acronym ? `${item.acronym} - ` : ''}
      {item?.usualName}
      {item?.name}
      {item?.nameFr}
      {item?.currentName?.usualName}
      {item?.resource?.currentName?.usualName}
    </>
  );
}

export function getPrizeName(item) {
  if (item?.name === item?.nameFr) {
    if (item?.nameEn) {
      return (
        <>
          {item?.name}
          {' - '}
          {item?.nameEn}
        </>
      );
    }
    return item?.name;
  }
  return item?.name;
}

export function getOtherNames(item) {
  const isNameEnDifferent = item?.nameEn && item.nameEn !== item.usualName;
  const isOfficialDifferent = (item?.usualName || item?.name) && item?.officialName && (item.officialName !== item.nameEn && item.officialName !== item.usualName);

  return (
    <>
      {isNameEnDifferent ? `${item.nameEn}` : ''}
      {isOfficialDifferent ? ` ${item.officialName}` : ''}
    </>
  );
}
