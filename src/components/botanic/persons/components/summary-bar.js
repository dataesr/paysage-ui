import { Link } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function SummaryBar({
  step, firstName, lastName, existingPersonId,
  selectedRelationType, startDate, selectedStructure,
}) {
  if (step === 1) return null;
  const personLabel = [firstName, lastName].filter(Boolean).join(' ') || (existingPersonId ? 'Fiche existante' : '');
  return (
    <div style={{
      background: 'var(--grey-975-75)',
      borderLeft: '3px solid var(--blue-france-sun-113-625)',
      borderRadius: '0 4px 4px 0',
      padding: '8px 16px',
      marginBottom: '20px',
      fontSize: '13px',
    }}
    >
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {personLabel && (
          <span>
            <strong>Personne :</strong>
            {` ${personLabel}`}
            {existingPersonId && (
              <Link target="_blank" href={`/persons/${existingPersonId}`} className="fr-badge fr-badge--sm fr-badge--success fr-ml-1w">Fiche existante</Link>
            )}
          </span>
        )}
        {step >= 3 && selectedRelationType && (
          <span>
            <strong>Fonction :</strong>
            {` ${selectedRelationType.name}${startDate ? ` · à partir du ${startDate}` : ''}`}
          </span>
        )}
        {step >= 4 && selectedStructure && (
          <span>
            <strong>Structure :</strong>
            {` ${selectedStructure.name}`}
          </span>
        )}
      </div>
    </div>
  );
}

SummaryBar.propTypes = {
  step: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  existingPersonId: PropTypes.string,
  selectedRelationType: PropTypes.shape({ name: PropTypes.string }),
  startDate: PropTypes.string.isRequired,
  selectedStructure: PropTypes.shape({ name: PropTypes.string }),
};
SummaryBar.defaultProps = { existingPersonId: undefined, selectedRelationType: null, selectedStructure: null };
