import PropTypes from 'prop-types';
import Button from '../../../button';

export default function IdRefPanel({ loading, matches, selectedMatch, onSelect }) {
  if (!loading && matches.length === 0) return null;
  return (
    <div className="fr-mt-3w">
      <p className="fr-text--sm fr-text--bold fr-mb-1w">
        {loading
          ? 'Recherche IdRef en cours…'
          : `IdRef · ${matches.length} correspondance${matches.length > 1 ? 's' : ''} trouvée${matches.length > 1 ? 's' : ''}`}
      </p>
      {loading && (
        <div className="fr-p-2w" style={{ background: 'var(--grey-975-75)', borderRadius: '4px' }}>
          <span className="fr-hint-text fr-text--sm">Interrogation du référentiel IdRef…</span>
        </div>
      )}
      {!loading && matches.map((m) => {
        const isSelected = selectedMatch?.idref === m.idref && m.idref;
        return (
          <div
            key={m.idref || m.full_name}
            style={{
              border: `2px solid ${isSelected ? 'var(--blue-france-sun-113-625)' : 'var(--grey-900-175)'}`,
              borderRadius: '4px',
              padding: '12px 16px',
              marginBottom: '8px',
              background: isSelected ? 'var(--blue-france-975-75)' : 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: 0 }}>
                <p className="fr-text--sm fr-mb-1v" style={{ fontWeight: '600' }}>{m.full_name}</p>
                {m.birth_date && (
                  <p className="fr-text--xs fr-hint-text fr-mb-1v">{`Né·e le ${m.birth_date.slice(0, 10)}`}</p>
                )}
                {(m.description || []).map((d, i) => (
                  <p key={i} className="fr-text--xs fr-mb-1v" style={{ color: 'var(--grey-425-625)' }}>{d}</p>
                ))}
                {(m.identifiers || []).length > 0 && (
                  <div className="fr-mt-1w">
                    {(() => { const pairs = []; (m.identifiers || []).forEach((idObj) => Object.entries(idObj).forEach((p) => pairs.push(p))); return pairs; })().map(([k, v]) => (
                      <span key={k} className="fr-badge fr-badge--sm fr-badge--blue-ecume fr-mr-1w fr-mb-1v">
                        {`${k} : ${v}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                <Button
                  size="sm"
                  secondary={!isSelected}
                  icon={isSelected ? 'ri-check-line' : 'ri-user-received-2-line'}
                  iconPosition="left"
                  onClick={() => onSelect(isSelected ? null : m)}
                >
                  {isSelected ? 'Sélectionné' : 'Utiliser ces données'}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

IdRefPanel.propTypes = {
  loading: PropTypes.bool.isRequired,
  matches: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedMatch: PropTypes.shape({ idref: PropTypes.string }),
  onSelect: PropTypes.func.isRequired,
};
IdRefPanel.defaultProps = { selectedMatch: null };
