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

    if (match.structureStatus) {
      const statusText = match.structureStatus === 'active'
        ? <span style={{ color: 'green' }}>Statut: Structure active ✓</span>
        : `Statut: ${match.structureStatus} ⚠️`;
      infos.push(statusText);
    }

    if (infos.length === 0) return '';

    return (
      <div>
        {infos.map((info, i) => (
          <Text size="sm" key={i}>{info}</Text>
        ))}
      </div>
    );
  }

  if (match.objectType === 'persons') {
    return match.activity ? (
      <div>
        <div>
          Fonction:
          {match.activity}
        </div>
      </div>
    ) : '';
  }

  return '';
}
