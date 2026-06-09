/* eslint-disable react/jsx-one-expression-per-line */
import PropTypes from 'prop-types';

export default function StructureSummaryBar({ step, selectedStructure, usualName, mandateCount }) {
  if (step === 1) return null;

  const structureLabel = selectedStructure?.name || usualName || null;

  return (
    <div
      className="fr-callout fr-callout--blue-ecume fr-mb-3w"
      style={{ padding: '12px 20px', borderLeftWidth: '4px' }}
    >
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {structureLabel && (
          <div>
            <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ fontWeight: 600 }}>Structure</p>
            <p className="fr-text--sm fr-mb-0">{structureLabel}</p>
          </div>
        )}
        {step >= 4 && mandateCount > 0 && (
          <div>
            <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ fontWeight: 600 }}>Mandats</p>
            <p className="fr-text--sm fr-mb-0">{mandateCount} mandat
              {mandateCount > 1 ? 's' : ''} ajouté{mandateCount > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

StructureSummaryBar.propTypes = {
  step: PropTypes.number.isRequired,
  selectedStructure: PropTypes.shape({ name: PropTypes.string }),
  usualName: PropTypes.string.isRequired,
  mandateCount: PropTypes.number.isRequired,
};

StructureSummaryBar.defaultProps = {
  selectedStructure: null,
};
