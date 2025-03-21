import { Text } from '@dataesr/react-dsfr';

export const getDisplayName = (row) => row.sourceQuery
  || row.Name
  || row.name
  || row['Full Name']
  || `${row.first_name || ''} ${row.last_name || ''}`.trim()
  || row.FullName
  || '';

export function formatMatchInfo(match) {
  if (!match) return '';

  if (match.objectType === 'structures') {
    const infos = [];
    if (match.category) infos.push(`Catégorie: ${match.category}`);
    if (match.city) infos.push(`Ville: ${match.city}`);
    if (match.acronym) infos.push(`Sigle: ${match.acronym}`);
    if (match.creationDate) infos.push(`Date de création: ${match.creationDate}`);

    let statusElem = null;
    if (match.structureStatus) {
      statusElem = match.structureStatus === 'active'
        ? <span style={{ color: 'green' }}>Statut : Structure active ✓</span>
        : (
          <span>
            Statut :
            {' '}
            {match.structureStatus}
            {' '}
            ⚠️
          </span>
        );
    }

    if (infos.length === 0 && !statusElem) return '';

    return (
      <div>
        {infos.length > 0 && <Text size="sm">{infos.join(' | ')}</Text>}

        {statusElem && <Text size="sm">{statusElem}</Text>}
      </div>
    );
  }

  if (match.objectType === 'persons') {
    return match.activity ? (
      <div>
        <Text size="sm">
          Fonction:
          {match.activity}
        </Text>
      </div>
    ) : '';
  }

  return '';
}
