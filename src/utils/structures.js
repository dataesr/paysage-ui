export function getName(item) {
  const isNameEnDifferent = item?.nameEn && item.nameEn !== item.usualName;
  const isOfficialDifferent = item?.officialName && (item.officialName !== item.nameEn && item.officialName !== item.usualName);

  return (
    <>
      {item?.shortName ? `${item.shortName} - ` : ''}
      {!item?.shortName && item?.acronymFr ? `${item.acronymFr} - ` : ''}
      {!item?.shortName && item?.acronym ? `${item.acronym} - ` : ''}
      {item?.usualName}
      {item?.name}
      {isNameEnDifferent ? ` - ${item.nameEn}` : ''}
      {isOfficialDifferent ? ` - ${item.officialName}` : ''}
    </>
  );
}
