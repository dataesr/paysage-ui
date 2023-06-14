export function getName(item) {
  return (
    <>
      {item?.shortName ? `${item.shortName} - ` : ''}
      {!item?.shortName && item?.acronymFr ? `${item.acronymFr} - ` : ''}
      {!item?.shortName && item?.acronym ? `${item.acronym} - ` : ''}
      {item?.usualName}
      {item?.name}
      {item?.nameFr}
    </>
  );
}
