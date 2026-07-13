import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Checkbox,
  Col,
  Radio,
  RadioGroup,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../../button';
import SearchBar from '../../../search-bar';
import DateInput from '../../../date-input';
import api from '../../../../utils/api';
import { GOUVERNANCE } from '../../../../utils/relations-tags';
import { getComparableNow } from '../../../../utils/dates';

const datesOverlap = (mStart, mEnd, newStart, newEnd) => {
  if (mEnd && newStart && mEnd < newStart) return false;
  if (mStart && newEnd && mStart > newEnd) return false;
  return true;
};

function useOTSearch() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    let cleanup = () => {};
    if (query) {
      let cancelled = false;
      cleanup = () => { cancelled = true; };
      setSearching(true);
      api.get(`/autocomplete?query=${encodeURIComponent(query)}&types=official-texts`)
        .then((res) => { if (!cancelled) { setOptions(res.data?.data || []); setSearching(false); } })
        .catch(() => { if (!cancelled) { setOptions([]); setSearching(false); } });
    } else {
      setOptions([]);
    }
    return cleanup;
  }, [query]);

  const select = ({ id: i, name: n }) => { setId(i); setName(n); setQuery(''); setOptions([]); };
  const unselect = () => { setId(null); setName(null); setQuery(''); setOptions([]); };
  const reset = () => { setId(null); setName(null); setQuery(''); setOptions([]); setSearching(false); };

  return { query, setQuery, options, searching, id, name, select, unselect, reset };
}

export default function StructureMandateStep({
  mandates, onAddMandate, onRemoveMandate, allRelationTypes, structureId,
}) {
  const [personQuery, setPersonQuery] = useState('');
  const [personOptions, setPersonOptions] = useState([]);
  const [personSearching, setPersonSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [relTypeQuery, setRelTypeQuery] = useState('');
  const [relTypeOptions, setRelTypeOptions] = useState([]);
  const [selectedRelType, setSelectedRelType] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endDatePrevisional, setEndDatePrevisional] = useState('');
  const [active, setActive] = useState(null);
  const [reason, setReason] = useState(null);
  const [temporary, setTemporary] = useState(false);
  const [position, setPosition] = useState(null);
  const [precision, setPrecision] = useState('');
  const [email, setEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');

  const startOT = useOTSearch();
  const endOT = useOTSearch();

  const [contactSuggestions, setContactSuggestions] = useState({ emails: [], personalEmails: [], phones: [] });

  const [errors, setErrors] = useState({});
  const [conflictWarning, setConflictWarning] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [conflictsToClose, setConflictsToClose] = useState({});

  useEffect(() => {
    if (!selectedPerson?.id) { setContactSuggestions({ emails: [], personalEmails: [], phones: [] }); return; }
    api.get(`/relations?filters[relatedObjectId]=${selectedPerson.id}&filters[relationTag]=${GOUVERNANCE}&limit=200`)
      .then(({ data: res }) => {
        const rels = res?.data || [];
        setContactSuggestions({
          emails: [...new Set(rels.map((r) => r.mandateEmail).filter(Boolean))],
          personalEmails: [...new Set(rels.map((r) => r.personalEmail).filter(Boolean))],
          phones: [...new Set(rels.map((r) => r.mandatePhonenumber).filter(Boolean))],
        });
      })
      .catch(() => {});
  // eslint-disable-next-line consistent-return
  }, [selectedPerson?.id]);

  useEffect(() => {
    const q = relTypeQuery.toLowerCase().trim();
    const list = q
      ? allRelationTypes.filter((rt) => rt.name.toLowerCase().includes(q))
      : allRelationTypes;
    setRelTypeOptions(list.slice(0, 30).map((rt) => ({ id: rt.id, name: rt.name })));
  }, [relTypeQuery, allRelationTypes]);

  const handlePersonQuery = async (q) => {
    setPersonQuery(q);
    if (!q || q.length < 2) { setPersonOptions([]); return; }
    setPersonSearching(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=persons&query=${encodeURIComponent(q)}`);
      setPersonOptions(res?.data || []);
    } catch { setPersonOptions([]); }
    setPersonSearching(false);
  };

  const resetForm = () => {
    setSelectedPerson(null); setPersonQuery(''); setPersonOptions([]);
    setSelectedRelType(null); setRelTypeQuery('');
    setStartDate(''); setEndDate(''); setEndDatePrevisional(''); setActive(null);
    setReason(null); setTemporary(false); setPosition(null);
    setPrecision(''); setEmail(''); setPersonalEmail(''); setPhonenumber('');
    startOT.reset(); endOT.reset();
    setContactSuggestions({ emails: [], personalEmails: [], phones: [] });
    setConflictWarning(null); setConflictsToClose({});
  };

  const doAdd = () => {
    const closures = (conflictWarning?.apiConflicts || [])
      .filter((m) => m.id in conflictsToClose)
      .map((m) => ({
        id: m.id,
        resourceId: m.resourceId,
        relatedObjectId: m.relatedObjectId,
        endDate: conflictsToClose[m.id] || null,
      }));
    onAddMandate({
      person: selectedPerson,
      relationType: selectedRelType,
      startDate,
      endDate,
      endDatePrevisional,
      active,
      reason,
      temporary,
      position,
      precision,
      email,
      personalEmail,
      phonenumber,
      startDateOfficialTextId: startOT.id,
      endDateOfficialTextId: endOT.id,
      closures,
    });
    resetForm();
  };

  const handleAdd = async () => {
    const errs = {};
    if (!selectedPerson) errs.personId = 'Veuillez sélectionner une personne.';
    if (!selectedRelType) errs.relTypeId = 'Veuillez choisir un type de mandat.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const newStart = startDate || null;
    const newEnd = endDate || null;

    const localConflicts = mandates.filter(
      (m) => m.relationType.id === selectedRelType.id
        && datesOverlap(m.startDate || null, m.endDate || null, newStart, newEnd),
    );

    let apiConflicts = [];
    if (structureId) {
      setIsChecking(true);
      try {
        const { data: res } = await api.get(`/relations?filters[relationTag]=${GOUVERNANCE}&filters[resourceId]=${structureId}&limit=500`);
        const now = getComparableNow();
        const activeRels = (res?.data || []).filter((m) => m.active !== false && (!m.endDate || m.endDate >= now));
        apiConflicts = activeRels.filter(
          (m) => (m.relationTypeId === selectedRelType.id || m.relationType?.id === selectedRelType.id)
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

      <div style={{ border: '1px dashed var(--border-default-grey)', borderRadius: '4px', padding: '16px', background: 'white' }}>
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
              isSearching={personSearching}
              size="lg"
            />
            {errors.personId && <p className="fr-error-text fr-text--sm fr-mt-1v">{errors.personId}</p>}
          </Col>

          <Col n="12">
            <SearchBar
              label="Type de mandat / fonction"
              hint="ex. Président, Directeur général, Chargé de mission…"
              placeholder="Rechercher un type de mandat..."
              value={selectedRelType ? '' : relTypeQuery}
              scope={selectedRelType ? selectedRelType.name : null}
              onChange={(e) => { setSelectedRelType(null); setRelTypeQuery(e.target.value); }}
              onDeleteScope={() => { setSelectedRelType(null); setRelTypeQuery(''); }}
              options={relTypeOptions}
              onSelect={(item) => { setSelectedRelType(item); setRelTypeQuery(''); }}
              isSearching={false}
              size="lg"
            />
            {errors.relTypeId && <p className="fr-error-text fr-text--sm fr-mt-1v">{errors.relTypeId}</p>}
          </Col>

          <Col n="12">
            <Accordion>
              <AccordionItem initExpand title="Informations du mandat">
                <Row gutters>
                  <Col n="12">
                    <TextInput
                      label="Intitulé exact de la fonction"
                      hint="Précisez si vous avez des informations plus détaillées."
                      value={precision}
                      onChange={(e) => setPrecision(e.target.value)}
                    />
                  </Col>
                  <Col n="12">
                    <RadioGroup legend="Raison du mandat :" isInline>
                      <Radio label="Élection" onChange={() => setReason('election')} checked={reason === 'election'} />
                      <Radio label="Nomination" onChange={() => setReason('nomination')} checked={reason === 'nomination'} />
                    </RadioGroup>
                  </Col>
                  <Col n="12">
                    <Checkbox
                      label="Mandat par intérim"
                      checked={temporary}
                      onChange={() => setTemporary(!temporary)}
                    />
                  </Col>
                  <Col n="12">
                    <RadioGroup legend="Position du mandat :" isInline>
                      <Radio label="1er mandat" onChange={() => setPosition('1')} checked={position === '1'} />
                      <Radio label="2ème mandat" onChange={() => setPosition('2')} checked={position === '2'} />
                      <Radio label="3ème mandat et plus" onChange={() => setPosition('3+')} checked={position === '3+'} />
                      <Radio label="Sans objet" onChange={() => setPosition(null)} checked={!position} />
                    </RadioGroup>
                  </Col>
                  {((!email && contactSuggestions.emails.length > 0)
                    || (!personalEmail && contactSuggestions.personalEmails.length > 0)
                    || (!phonenumber && contactSuggestions.phones.length > 0)) && (
                    <Col n="12">
                      <div style={{ background: 'var(--grey-975-75)', borderRadius: '4px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span className="fr-text--xs fr-hint-text">Contacts précédents — cliquer pour pré-remplir :</span>
                        {!email && contactSuggestions.emails.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                            <span className="fr-text--xs" style={{ flexShrink: 0, color: 'var(--grey-425-625)', minWidth: '130px' }}>Email mandat :</span>
                            {contactSuggestions.emails.map((e) => (
                              <button
                                key={`email-${e}`}
                                type="button"
                                className="fr-badge fr-badge--sm fr-badge--blue-cumulus"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setEmail(e)}
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                        {!personalEmail && contactSuggestions.personalEmails.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                            <span className="fr-text--xs" style={{ flexShrink: 0, color: 'var(--grey-425-625)', minWidth: '130px' }}>Email nominatif :</span>
                            {contactSuggestions.personalEmails.map((e) => (
                              <button
                                key={`personal-${e}`}
                                type="button"
                                className="fr-badge fr-badge--sm fr-badge--blue-ecume"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setPersonalEmail(e)}
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                        {!phonenumber && contactSuggestions.phones.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                            <span className="fr-text--xs" style={{ flexShrink: 0, color: 'var(--grey-425-625)', minWidth: '130px' }}>Téléphone :</span>
                            {contactSuggestions.phones.map((p) => (
                              <button
                                key={`phone-${p}`}
                                type="button"
                                className="fr-badge fr-badge--sm fr-badge--green-emeraude"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setPhonenumber(p)}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </Col>
                  )}
                  <Col n="12 md-6">
                    <TextInput label="Email associé au mandat" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Col>
                  <Col n="12 md-6">
                    <TextInput label="Email nominatif" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
                  </Col>
                  <Col n="12 md-6">
                    <TextInput label="Numéro de téléphone" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
                  </Col>
                  <Col n="12 md-6">
                    <DateInput value={startDate} label="Date de prise de fonction" onDateChange={setStartDate} />
                  </Col>
                  <Col n="12 md-6">
                    <DateInput value={endDatePrevisional} label="Date de fin prévisionnelle" onDateChange={setEndDatePrevisional} />
                    <SearchBar
                      buttonLabel="Rechercher"
                      value={startOT.query}
                      label="Texte officiel de début"
                      hint="Rechercher un texte officiel"
                      scope={startOT.name}
                      placeholder={startOT.name ? '' : 'Rechercher...'}
                      onChange={(e) => startOT.setQuery(e.target.value)}
                      options={startOT.options}
                      onSelect={startOT.select}
                      onDeleteScope={startOT.unselect}
                      isSearching={startOT.searching}
                    />
                  </Col>
                  <Col n="12 md-6">
                    <DateInput value={endDate} label="Date de fin de fonction" onDateChange={setEndDate} />
                    <Checkbox
                      label="Date de fin inconnue mais passée"
                      onChange={(e) => setActive(!e.target.checked)}
                      checked={active === false}
                    />
                    <SearchBar
                      buttonLabel="Rechercher"
                      value={endOT.query}
                      label="Texte officiel de fin"
                      hint="Rechercher un texte officiel"
                      scope={endOT.name}
                      placeholder={endOT.name ? '' : 'Rechercher...'}
                      onChange={(e) => endOT.setQuery(e.target.value)}
                      options={endOT.options}
                      onSelect={endOT.select}
                      onDeleteScope={endOT.unselect}
                      isSearching={endOT.searching}
                    />
                  </Col>
                </Row>
              </AccordionItem>
            </Accordion>
          </Col>

          {conflictWarning && (
            <Col n="12">
              <div className="fr-alert fr-alert--warning">
                <p className="fr-alert__title">
                  {`Conflit de mandat : "${selectedRelType?.name}"`}
                </p>
                {conflictWarning.apiConflicts.length > 0 && (
                  <>
                    <p className="fr-text--sm fr-mb-1w">
                      {conflictWarning.apiConflicts.length === 1
                        ? 'Une personne a déjà ce type de mandat dans cette structure :'
                        : `${conflictWarning.apiConflicts.length} personnes ont déjà ce type de mandat :`}
                    </p>
                    {conflictWarning.apiConflicts.map((m) => {
                      const personName = m.relatedObject?.displayName || m.relatedObjectId;
                      const relName = m.relationType?.name || '';
                      return (
                        <div key={m.id} style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexShrink: 0, cursor: 'pointer', fontSize: '13px' }}>
                              <input
                                type="checkbox"
                                checked={m.id in conflictsToClose}
                                onChange={() => setConflictsToClose((prev) => {
                                  const next = { ...prev };
                                  if (m.id in next) delete next[m.id]; else next[m.id] = '';
                                  return next;
                                })}
                              />
                              Clôturer
                            </label>
                            <div style={{ flex: 1, border: '1px solid var(--grey-925-125)', borderRadius: '4px', padding: '8px 12px', background: 'white' }}>
                              <p className="fr-text--sm fr-mb-0"><strong>{personName}</strong></p>
                              {relName && <p className="fr-text--xs fr-mb-0" style={{ color: 'var(--grey-425-625)' }}>{relName}</p>}
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
                      );
                    })}
                  </>
                )}
                {conflictWarning.localConflicts.length > 0 && (
                  <p className="fr-text--sm fr-mb-0">
                    {`Dans ce formulaire : ${conflictWarning.localConflicts.map((lc) => lc.person.name).join(', ')} ont déjà un mandat de ce type.`}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Button size="sm" secondary onClick={() => setConflictWarning(null)}>Annuler</Button>
                  <Button size="sm" onClick={doAdd}>
                    {Object.keys(conflictsToClose).length > 0
                      ? `Ajouter (clôturera ${Object.keys(conflictsToClose).length} mandat${Object.keys(conflictsToClose).length > 1 ? 's' : ''})`
                      : 'Ajouter ce mandat'}
                  </Button>
                </div>
              </div>
            </Col>
          )}

          <Col n="12">
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
  mandates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onAddMandate: PropTypes.func.isRequired,
  onRemoveMandate: PropTypes.func.isRequired,
  allRelationTypes: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  structureId: PropTypes.string,
};
StructureMandateStep.defaultProps = { structureId: null };
