import { useEffect, useState } from 'react';
import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchBar from '../../../search-bar';
import DateInput from '../../../date-input';
import Button from '../../../button';
import api from '../../../../utils/api';
import { GOUVERNANCE } from '../../../../utils/relations-tags';
import { getComparableNow } from '../../../../utils/dates';

const datesOverlap = (mStart, mEnd, newStart, newEnd) => {
  if (mEnd && newStart && mEnd < newStart) return false;
  if (mStart && newEnd && mStart > newEnd) return false;
  return true;
};

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
    <div style={{ border: '1px solid var(--grey-925-125)', borderRadius: '4px', padding: '10px 14px', marginBottom: '6px', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {personHref ? (
          <Link to={personHref} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '14px' }}>
            {personName}
          </Link>
        ) : (
          <strong style={{ fontSize: '14px' }}>{personName}</strong>
        )}
        {m.mandateTemporary && <span className="fr-badge fr-badge--sm fr-badge--new">Temporaire</span>}
      </div>
      {m.relationType?.name && (
        <p className="fr-text--sm fr-mb-0" style={{ color: 'var(--grey-425-625)', marginTop: '2px' }}>{m.relationType.name}</p>
      )}
      <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ marginTop: '4px' }}>
        {period}
        {m.endDatePrevisional ? ` - fin previsionnelle : ${formatDate(m.endDatePrevisional)}` : ''}
      </p>
      {(addedBy || addedOn) && (
        <p className="fr-text--xs fr-hint-text fr-mb-0" style={{ marginTop: '4px' }}>
          {`Ajouté${addedBy ? ` par ${addedBy}` : ''}${addedOn ? ` le ${addedOn}` : ''}`}
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
    createdAt: PropTypes.string,
    createdBy: PropTypes.shape({ firstName: PropTypes.string, lastName: PropTypes.string }),
  }).isRequired,
};

export default function StructureMandateStep({ mandates, onAddMandate, onRemoveMandate, allRelationTypes, structureId }) {
  const [personQuery, setPersonQuery] = useState('');
  const [personOptions, setPersonOptions] = useState([]);
  const [isSearchingPerson, setIsSearchingPerson] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [relationTypeQuery, setRelationTypeQuery] = useState('');
  const [relationTypeOptions, setRelationTypeOptions] = useState([]);
  const [selectedRelationType, setSelectedRelationType] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});
  const [conflictWarning, setConflictWarning] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [conflictsToClose, setConflictsToClose] = useState({});

  useEffect(() => {
    const q = relationTypeQuery.toLowerCase().trim();
    const filtered = q
      ? allRelationTypes.filter((rt) => rt.name.toLowerCase().includes(q))
      : allRelationTypes;
    setRelationTypeOptions(filtered.slice(0, 30).map((rt) => ({ id: rt.id, name: rt.name })));
  }, [relationTypeQuery, allRelationTypes]);

  const handlePersonQuery = async (q) => {
    setPersonQuery(q);
    if (!q || q.length < 2) { setPersonOptions([]); return; }
    setIsSearchingPerson(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=persons&query=${encodeURIComponent(q)}`);
      setPersonOptions(res?.data || []);
    } catch {
      setPersonOptions([]);
    }
    setIsSearchingPerson(false);
  };

  const doAdd = () => {
    const closures = (conflictWarning?.apiConflicts || [])
      .filter((m) => m.id in conflictsToClose)
      .map((m) => ({ id: m.id, resourceId: m.resourceId, relatedObjectId: m.relatedObjectId, endDate: conflictsToClose[m.id] || null }));
    setConflictWarning(null);
    setConflictsToClose({});
    onAddMandate({
      person: selectedPerson, relationType: selectedRelationType, startDate, endDate, closures,
    });
    setSelectedPerson(null);
    setPersonQuery('');
    setPersonOptions([]);
    setSelectedRelationType(null);
    setRelationTypeQuery('');
    setStartDate('');
    setEndDate('');
  };

  const handleAdd = async () => {
    const errs = {};
    if (!selectedPerson) errs.personId = 'Veuillez sélectionner une personne.';
    if (!selectedRelationType) errs.relationTypeId = 'Veuillez choisir un type de mandat.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const newStart = startDate || null;
    const newEnd = endDate || null;

    const localConflicts = mandates.filter(
      (m) => m.relationType.id === selectedRelationType.id
        && datesOverlap(m.startDate || null, m.endDate || null, newStart, newEnd),
    );

    let apiConflicts = [];
    if (structureId) {
      setIsChecking(true);
      try {
        const { data: res } = await api.get(`/relations?filters[relationTag]=${GOUVERNANCE}&filters[resourceId]=${structureId}&limit=500`);
        const active = (res?.data || []).filter((m) => m.active !== false && (!m.endDate || m.endDate >= getComparableNow()));
        apiConflicts = active.filter(
          (m) => (m.relationTypeId === selectedRelationType.id || m.relationType?.id === selectedRelationType.id)
            && datesOverlap(m.startDate || null, m.endDate || null, newStart, newEnd),
        );
      } catch { /* ignore */ }
      setIsChecking(false);
    }

    if (localConflicts.length > 0 || apiConflicts.length > 0) {
      setConflictWarning({ localConflicts, apiConflicts });
      setConflictsToClose(Object.fromEntries(apiConflicts.map((m) => [m.id, ''])));
      return;
    }

    doAdd();
  };

  return (
    <div>
      <p className="fr-text--sm fr-hint-text fr-mb-3w">
        Étape optionnelle. Ajoutez un ou plusieurs mandats de gouvernance.
      </p>

      {mandates.length > 0 && (
        <div className="fr-mb-3w">
          {mandates.map((m) => (
            <div
              key={m._key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-default-grey)',
                borderRadius: '4px',
                padding: '10px 14px',
                marginBottom: '8px',
                background: 'var(--background-alt-grey)',
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>{m.person.name}</span>
                <span className="fr-text--sm fr-hint-text fr-ml-1w">{m.relationType.name}</span>
                {(m.startDate || m.endDate) && (
                  <span className="fr-text--sm fr-hint-text fr-ml-1w">
                    {m.startDate && `· du ${m.startDate.slice(0, 4)}`}
                    {m.endDate && ` au ${m.endDate.slice(0, 4)}`}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                secondary
                icon="ri-delete-bin-line"
                title="Supprimer ce mandat"
                onClick={() => onRemoveMandate(m._key)}
              />
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          border: '1px dashed var(--border-default-grey)',
          borderRadius: '4px',
          padding: '16px',
          background: 'white',
        }}
      >
        <p className="fr-text--sm fr-mb-2w" style={{ fontWeight: 600 }}>
          {mandates.length === 0 ? 'Ajouter un mandat' : 'Ajouter un autre mandat'}
        </p>

        <Row gutters>
          <Col n="12">
            <SearchBar
              label="Personne"
              hint="Rechercher la personne à qui attribuer le mandat"
              placeholder="Nom de la personne..."
              value={selectedPerson ? '' : personQuery}
              scope={selectedPerson ? selectedPerson.name : null}
              onChange={(e) => { setSelectedPerson(null); handlePersonQuery(e.target.value); }}
              onDeleteScope={() => { setSelectedPerson(null); setPersonQuery(''); }}
              options={personOptions}
              onSelect={(item) => { setSelectedPerson(item); setPersonQuery(''); setPersonOptions([]); }}
              isSearching={isSearchingPerson}
              size="lg"
            />
            {errors.personId && <p className="fr-error-text fr-text--sm fr-mt-1v">{errors.personId}</p>}
          </Col>

          <Col n="12">
            <SearchBar
              label="Type de mandat / fonction"
              hint="ex. Président, Directeur général, Chargé de mission…"
              placeholder="Rechercher un type de mandat..."
              value={selectedRelationType ? '' : relationTypeQuery}
              scope={selectedRelationType ? selectedRelationType.name : null}
              onChange={(e) => { setSelectedRelationType(null); setRelationTypeQuery(e.target.value); }}
              onDeleteScope={() => { setSelectedRelationType(null); setRelationTypeQuery(''); }}
              options={relationTypeOptions}
              onSelect={(item) => { setSelectedRelationType(item); setRelationTypeQuery(''); }}
              isSearching={false}
              size="lg"
            />
            {errors.relationTypeId && <p className="fr-error-text fr-text--sm fr-mt-1v">{errors.relationTypeId}</p>}
          </Col>

          <Col n="12 md-6">
            <DateInput label="Date de début" value={startDate} onDateChange={setStartDate} />
          </Col>
          <Col n="12 md-6">
            <DateInput label="Date de fin" value={endDate} onDateChange={setEndDate} />
          </Col>

          <Col n="12">
            {conflictWarning && (
              <div className="fr-alert fr-alert--warning fr-mb-2w">
                <p className="fr-alert__title">
                  {`Conflit de mandat : "${selectedRelationType?.name}"`}
                </p>
                {conflictWarning.apiConflicts.length > 0 && (
                  <>
                    <p className="fr-text--sm fr-mb-1w">
                      {conflictWarning.apiConflicts.length === 1
                        ? 'Une personne a déjà ce type de mandat dans cette structure sur cette période :'
                        : `${conflictWarning.apiConflicts.length} personnes ont déjà ce type de mandat dans cette structure sur cette période :`}
                    </p>
                    <p className="fr-text--xs fr-hint-text fr-mb-1w">
                      Cochez les mandats à clôturer lors de l&apos;enregistrement de la structure et indiquez la date de clôture.
                    </p>
                    <div className="fr-mb-2w">
                      {conflictWarning.apiConflicts.map((m) => (
                        <div key={m.id} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexShrink: 0, cursor: 'pointer', fontSize: '13px' }}>
                              <input
                                type="checkbox"
                                checked={m.id in conflictsToClose}
                                onChange={(e) => {
                                  setConflictsToClose((prev) => {
                                    const next = { ...prev };
                                    if (e.target.checked) next[m.id] = ''; else delete next[m.id];
                                    return next;
                                  });
                                }}
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
                                onDateChange={(date) => setConflictsToClose((prev) => ({ ...prev, [m.id]: date }))}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {conflictWarning.localConflicts.length > 0 && (
                  <div className="fr-mb-1w">
                    {conflictWarning.localConflicts.length === 1 ? (
                      <p className="fr-text--sm fr-mb-0">
                        Dans ce formulaire,
                        {' '}
                        <strong>{conflictWarning.localConflicts[0].person.name}</strong>
                        {` a déjà un mandat de type "${selectedRelationType?.name}" sur la même période.`}
                      </p>
                    ) : (
                      <p className="fr-text--sm fr-mb-0">
                        {`Dans ce formulaire, ${conflictWarning.localConflicts.length} personnes ont déjà un mandat de type "${selectedRelationType?.name}" sur la même période : `}
                        {conflictWarning.localConflicts.map((lc, i) => (
                          <span key={lc._key}>
                            {i > 0 && ', '}
                            <strong>{lc.person.name}</strong>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <Button size="sm" secondary onClick={() => setConflictWarning(null)}>
                    Annuler
                  </Button>
                  <Button size="sm" onClick={doAdd}>
                    {Object.keys(conflictsToClose).length > 0
                      ? `Ajouter (clôturera ${Object.keys(conflictsToClose).length} mandat${Object.keys(conflictsToClose).length > 1 ? 's' : ''} à l'enregistrement)`
                      : 'Ajouter ce mandat'}
                  </Button>
                </div>
              </div>
            )}
            <Button size="sm" icon="ri-add-line" iconPosition="left" onClick={handleAdd} disabled={isChecking}>
              {isChecking ? 'Vérification...' : 'Ajouter ce mandat'}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

StructureMandateStep.propTypes = {
  mandates: PropTypes.arrayOf(PropTypes.shape({
    _key: PropTypes.string.isRequired,
    person: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }).isRequired,
    relationType: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }).isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  })).isRequired,
  onAddMandate: PropTypes.func.isRequired,
  onRemoveMandate: PropTypes.func.isRequired,
  allRelationTypes: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  structureId: PropTypes.string,
};
StructureMandateStep.defaultProps = { structureId: null };
