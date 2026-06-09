import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../../../button';
import SearchBar from '../../../search-bar';
import DateInput from '../../../date-input';

function MandateCard({ m }) {
  const formatDate = (d) => {
    if (!d) return null;
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
    return parts[0];
  };

  let period = 'dates non renseignées';
  if (m.startDate && m.endDate) period = `du ${formatDate(m.startDate)} au ${formatDate(m.endDate)}`;
  else if (m.startDate) period = `depuis le ${formatDate(m.startDate)}`;
  else if (m.endDate) period = `jusqu'au ${formatDate(m.endDate)}`;

  const personName = m.relatedObject?.displayName || m.relatedObjectId;
  const personHref = m.relatedObject?.href;
  const addedBy = m.createdBy
    ? [m.createdBy.firstName, m.createdBy.lastName].filter(Boolean).join(' ')
    : null;
  const addedOn = m.createdAt
    ? new Date(m.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <div style={{ border: '1px solid var(--grey-925-125)', borderRadius: '4px', padding: '12px 16px', marginBottom: '8px', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {personHref ? (
            <Link to={personHref} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '14px' }}>
              {personName}
            </Link>
          ) : (
            <strong style={{ fontSize: '14px' }}>{personName}</strong>
          )}
          {m.mandateTemporary && (
            <span className="fr-badge fr-badge--sm fr-badge--new">Temporaire</span>
          )}
        </div>
      </div>
      {m.relationType?.name && (
        <p className="fr-text--sm fr-mb-0" style={{ color: 'var(--grey-425-625)', marginTop: '2px' }}>{m.relationType.name}</p>
      )}
      <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ marginTop: '4px' }}>
        {period}
        {m.endDatePrevisional ? ` · fin prévisionnelle : ${formatDate(m.endDatePrevisional)}` : ''}
      </p>
      {(m.mandatePrecision || m.mandateReason) && (
        <p className="fr-text--xs fr-mb-0" style={{ marginTop: '4px', fontStyle: 'italic' }}>
          {[m.mandatePrecision, m.mandateReason].filter(Boolean).join(' — ')}
        </p>
      )}
      {(addedBy || addedOn) && (
        <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ marginTop: '4px' }}>
          {`Ajouté${addedBy ? ` par ${addedBy}` : ''}${addedOn ? ` le ${addedOn}` : ''}`}
        </p>
      )}
      {(m.mandateEmail || m.mandatePhonenumber) && (
        <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ marginTop: '4px' }}>
          {[m.mandateEmail, m.mandatePhonenumber].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  );
}

MandateCard.propTypes = {
  m: PropTypes.shape({
    relatedObject: PropTypes.shape({ displayName: PropTypes.string, href: PropTypes.string }),
    relatedObjectId: PropTypes.string,
    relationType: PropTypes.shape({ name: PropTypes.string }),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    endDatePrevisional: PropTypes.string,
    mandateTemporary: PropTypes.bool,
    mandatePrecision: PropTypes.string,
    mandateReason: PropTypes.string,
    mandateEmail: PropTypes.string,
    mandatePhonenumber: PropTypes.string,
    createdAt: PropTypes.string,
    createdBy: PropTypes.shape({ firstName: PropTypes.string, lastName: PropTypes.string }),
  }).isRequired,
};

export default function StructureStep({
  query, setQuery, options, isSearching,
  selectedStructure, onSelect, onUnselect,
  relatedConflicts,
  conflictsToClose, onToggleConflictToClose, onSetClosureDate,
  selectedRelationType,
  onGoBack,
}) {
  return (
    <Row gutters>
      <Col n="12">
        <SearchBar
          buttonLabel="Rechercher"
          label="Structure"
          hint="Recherche en temps réel dans le référentiel Paysage"
          value={selectedStructure ? '' : query}
          placeholder="Rechercher une structure…"
          scope={selectedStructure ? selectedStructure.name : null}
          onChange={(e) => { onUnselect(); setQuery(e.target.value); }}
          onDeleteScope={onUnselect}
          options={options}
          onSelect={onSelect}
          isSearching={isSearching}
          size="lg"
        />
      </Col>
      {selectedStructure && relatedConflicts.length > 0 && (
        <Col n="12">
          <div className="fr-alert fr-alert--warning">
            <p className="fr-alert__title">
              {`Conflit de mandat : "${selectedRelationType?.name}"`}
            </p>
            <p className="fr-text--sm fr-mb-1w">
              {relatedConflicts.length === 1
                ? 'Une personne a déjà ce type de mandat dans cette structure sur cette période :'
                : `${relatedConflicts.length} personnes ont déjà ce type de mandat dans cette structure sur cette période :`}
            </p>
            <p className="fr-text--xs fr-hint-text fr-mb-1w">
              Cochez les mandats à clôturer lors de l&apos;enregistrement et indiquez la date de clôture.
            </p>
            <div className="fr-mb-2w">
              {relatedConflicts.map((m) => (
                <div key={m.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexShrink: 0, cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={m.id in conflictsToClose}
                        onChange={() => onToggleConflictToClose(m.id)}
                      />
                      Clôturer
                    </label>
                    <div style={{ flex: 1 }}>
                      <MandateCard m={m} />
                    </div>
                  </div>
                  {m.id in conflictsToClose && (
                    <div style={{ marginTop: '4px', marginLeft: '80px' }}>
                      <DateInput
                        label="Date de clôture"
                        hint="Laisser vide pour utiliser la date du jour"
                        value={conflictsToClose[m.id]}
                        onDateChange={(date) => onSetClosureDate(m.id, date)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button secondary onClick={onGoBack}>
                Modifier la fonction ou les dates
              </Button>
            </div>
          </div>
        </Col>
      )}
    </Row>
  );
}

StructureStep.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isSearching: PropTypes.bool.isRequired,
  selectedStructure: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string, acronym: PropTypes.string }),
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
  relatedConflicts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  conflictsToClose: PropTypes.shape({}).isRequired,
  onToggleConflictToClose: PropTypes.func.isRequired,
  onSetClosureDate: PropTypes.func.isRequired,
  selectedRelationType: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onGoBack: PropTypes.func.isRequired,
};
StructureStep.defaultProps = { selectedStructure: null, selectedRelationType: null };
