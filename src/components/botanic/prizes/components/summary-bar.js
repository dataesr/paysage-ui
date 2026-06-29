import PropTypes from 'prop-types';

export default function PrizeSummaryBar({ step, selectedPrize, nameFr, selectedLaureate, selectedRelationType }) {
  if (step === 1) return null;

  const prizeLabel = selectedPrize?.name || nameFr || null;

  return (
    <div
      className="fr-callout fr-callout--blue-ecume fr-mb-3w"
      style={{ padding: '12px 20px', borderLeftWidth: '4px' }}
    >
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {prizeLabel && (
          <div>
            <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ fontWeight: 600 }}>Prix</p>
            <p className="fr-text--sm fr-mb-0">{prizeLabel}</p>
          </div>
        )}
        {selectedLaureate && (
          <div>
            <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ fontWeight: 600 }}>Lauréat</p>
            <p className="fr-text--sm fr-mb-0">{selectedLaureate.name}</p>
          </div>
        )}
        {selectedRelationType && (
          <div>
            <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ fontWeight: 600 }}>Type</p>
            <p className="fr-text--sm fr-mb-0">{selectedRelationType.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

PrizeSummaryBar.propTypes = {
  step: PropTypes.number.isRequired,
  selectedPrize: PropTypes.shape({ name: PropTypes.string }),
  nameFr: PropTypes.string.isRequired,
  selectedLaureate: PropTypes.shape({ name: PropTypes.string }),
  selectedRelationType: PropTypes.shape({ name: PropTypes.string }),
};

PrizeSummaryBar.defaultProps = {
  selectedPrize: null,
  selectedLaureate: null,
  selectedRelationType: null,
};
