import { useMemo, useState } from 'react';
import {
  Checkbox, Col, Radio, RadioGroup, Row, Select, Stepper, Tag, TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../../button';
import SearchBar from '../../search-bar';
import DateInput from '../../date-input';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import { getComparableNow } from '../../../utils/dates';
import { uid, OFFICIAL_TEXT_NATURE_OPTIONS, OFFICIAL_TEXT_TYPE_OPTIONS } from '../utils';
import MandateRow from './components/mandate-row';
import EntityField from './components/entity-field';
import PersonFlow from '../persons';
import StructureFlow from '../structures';

const STEPS = ['Texte juridique', 'Objets concernés', 'Récapitulatif'];

const emptyRow = (defaults = {}) => ({
  _key: uid(),
  person: null,
  relType: null,
  relTypeQuery: '',
  structure: null,
  startDate: defaults.startDate || '',
  endDate: '',
  endDatePrevisional: defaults.endDatePrevisional || '',
  precision: '',
  reason: null,
  temporary: false,
  email: '',
  personalEmail: '',
  phonenumber: '',
  closureCandidates: [],
  closures: {},
  contactSuggestions: null,
});

const emptyClosureSection = () => ({ _key: uid(), structure: null, candidates: [], selected: {} });

const fetchActiveMandates = async (structureId) => {
  try {
    const { data } = await api.get(`/relations?filters[relationTag]=${GOUVERNANCE}&filters[resourceId]=${structureId}&limit=500`);
    const now = getComparableNow();
    return (data?.data || [])
      .filter((m) => m.active !== false && (!m.endDate || m.endDate >= now))
      .map((m) => ({
        id: m.id,
        relatedObjectId: m.relatedObjectId,
        resourceId: m.resourceId,
        relTypeId: m.relationTypeId || m.relationType?.id,
        personName: m.relatedObject?.displayName || m.relatedObjectId,
        relTypeName: m.relationType?.name || '',
      }));
  } catch { return []; }
};

const fetchPersonContacts = async (personId) => {
  try {
    const { data } = await api.get(`/relations?filters[relatedObjectId]=${personId}&filters[relationTag]=${GOUVERNANCE}&limit=500`);
    const rels = data?.data || [];
    return {
      emails: [...new Set(rels.map((r) => r.mandateEmail).filter(Boolean))],
      personalEmails: [...new Set(rels.map((r) => r.personalEmail).filter(Boolean))],
      phones: [...new Set(rels.map((r) => r.mandatePhonenumber).filter(Boolean))],
    };
  } catch { return { emails: [], personalEmails: [], phones: [] }; }
};

export default function MandateFlow({ onClose }) {
  const { notice } = useNotice();
  const navigate = useNavigate();
  const { data: relationTypesData } = useFetch('/relation-types?limit=500&filters[for]=persons');
  const allRelationTypes = useMemo(() => relationTypesData?.data || [], [relationTypesData]);

  const [step, setStep] = useState(1);

  const [hasText, setHasText] = useState(null);
  const [textMode, setTextMode] = useState('search'); // 'search' | 'create'
  const [textQuery, setTextQuery] = useState('');
  const [textOptions, setTextOptions] = useState([]);
  const [textSearching, setTextSearching] = useState(false);
  const [officialText, setOfficialText] = useState(null);
  const [draft, setDraft] = useState({ nature: '', type: '', jorftext: '', nor: '', title: '', pageUrl: '', publicationDate: '', signatureDate: '' });
  const [defaultStartDate, setDefaultStartDate] = useState('');
  const [defaultEndDate, setDefaultEndDate] = useState('');
  const [defaultEndPrevisional, setDefaultEndPrevisional] = useState('');

  const [concerns, setConcerns] = useState({ mandates: true, closures: false });
  const [rows, setRows] = useState([emptyRow()]);
  const [closureSections, setClosureSections] = useState([emptyClosureSection()]);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(null); // { kind, apply }

  const openCreateOverlay = (kind, apply) => setCreateOverlay({ kind, apply });
  const closeCreateOverlay = () => setCreateOverlay(null);
  const handleOverlayCreated = (entity) => {
    if (createOverlay?.apply) createOverlay.apply(entity);
    setCreateOverlay(null);
  };

  const handleSelectOfficialText = async (item) => {
    setOfficialText(item);
    setTextQuery('');
    setTextOptions([]);
    try {
      const { data } = await api.get(`/official-texts/${item.id}`);
      setOfficialText((prev) => ({ ...prev, pageUrl: data.pageUrl }));
      if (data.startDate) setDefaultStartDate(data.startDate);
      if (data.endDate) setDefaultEndDate(data.endDate);
      if (data.previsionalEndDate || data.endDate) setDefaultEndPrevisional(data.previsionalEndDate || data.endDate);
      if (data.publicationDate) setDraft((p) => ({ ...p, publicationDate: data.publicationDate }));
      if (data.signatureDate) setDraft((p) => ({ ...p, signatureDate: data.signatureDate }));
    } catch { /* */ }
  };

  const searchText = async (q) => {
    setTextQuery(q);
    if (!q || q.length < 2) { setTextOptions([]); return; }
    setTextSearching(true);
    try {
      const { data } = await api.get(`/autocomplete?types=official-texts&query=${encodeURIComponent(q)}`);
      setTextOptions(data?.data || []);
    } catch { setTextOptions([]); }
    setTextSearching(false);
  };

  const updateRow = (key, patch) => setRows((prev) => prev.map((r) => (r._key === key ? { ...r, ...patch } : r)));

  const handleRowStructureSelect = async (key, structure) => {
    updateRow(key, { structure, closureCandidates: [], closures: {} });
    const candidates = await fetchActiveMandates(structure.id);
    updateRow(key, { closureCandidates: candidates });
  };

  const handleRowPersonSelect = async (key, person) => {
    updateRow(key, { person, contactSuggestions: null });
    const contacts = await fetchPersonContacts(person.id);
    updateRow(key, { contactSuggestions: contacts });
  };

  const handleAddRow = () => setRows((prev) => [...prev, emptyRow({ startDate: defaultStartDate, endDatePrevisional: defaultEndPrevisional })]);
  const handleRemoveRow = (key) => setRows((prev) => prev.filter((r) => r._key !== key));

  const updateClosureSection = (key, patch) => setClosureSections((prev) => prev.map((s) => (s._key === key ? { ...s, ...patch } : s)));
  const handleClosureStructureSelect = async (key, structure) => {
    updateClosureSection(key, { structure, candidates: [], selected: {} });
    const candidates = await fetchActiveMandates(structure.id);
    updateClosureSection(key, { candidates });
  };
  const handleAddClosureSection = () => setClosureSections((prev) => [...prev, emptyClosureSection()]);
  const handleRemoveClosureSection = (key) => setClosureSections((prev) => prev.filter((s) => s._key !== key));

  const handleNextFromText = () => {
    if (hasText === true && textMode === 'create') {
      const d = draft;
      if (!d.nature || !d.type || !d.title.trim() || !d.pageUrl.trim() || !d.publicationDate) {
        setShowErrors(true);
        notice({ content: 'Complétez les champs obligatoires du texte juridique.', type: 'error' });
        return;
      }
    }
    if (defaultStartDate || defaultEndPrevisional) {
      setRows((prev) => prev.map((r) => ({
        ...r,
        startDate: r.startDate || defaultStartDate,
        endDatePrevisional: r.endDatePrevisional || defaultEndPrevisional,
      })));
    }
    setShowErrors(false);
    setStep(2);
  };

  const validRows = concerns.mandates ? rows.filter((r) => r.person && r.relType && r.structure) : [];
  const closuresFromRows = validRows.flatMap((r) => Object.entries(r.closures || {}).map(([id, endDate]) => {
    const cand = (r.closureCandidates || []).find((c) => c.id === id);
    return cand ? { ...cand, endDate } : null;
  })).filter(Boolean);
  const closuresFromSections = concerns.closures
    ? closureSections.flatMap((s) => Object.entries(s.selected || {}).map(([id, endDate]) => {
      const cand = (s.candidates || []).find((c) => c.id === id);
      return cand ? { ...cand, endDate } : null;
    })).filter(Boolean)
    : [];
  const allClosures = [...closuresFromRows, ...closuresFromSections];

  const totalActions = validRows.length + allClosures.length;

  const handleGoToRecap = () => {
    if (concerns.mandates && rows.some((r) => r.person || r.relType || r.structure) && validRows.length === 0) {
      setShowErrors(true);
      notice({ content: 'Complétez au moins un mandat (personne, type et structure).', type: 'error' });
      return;
    }
    if (totalActions === 0) {
      notice({ content: 'Aucune action à enregistrer.', type: 'error' });
      return;
    }
    setShowErrors(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setHasText(null); setTextMode('search');
    setTextQuery(''); setTextOptions([]); setTextSearching(false); setOfficialText(null);
    setDraft({ nature: '', type: '', jorftext: '', nor: '', title: '', pageUrl: '', publicationDate: '', signatureDate: '' });
    setDefaultStartDate(''); setDefaultEndDate(''); setDefaultEndPrevisional('');
    setConcerns({ mandates: true, closures: false });
    setRows([emptyRow()]);
    setClosureSections([emptyClosureSection()]);
    setShowErrors(false); setSubmitting(false);
    onClose();
  };

  const normalizeUrl = (url) => (url && !url.match(/^https?:\/\//) ? `https://${url}` : url);

  const resolveOfficialTextId = async (relatesToIds) => {
    if (hasText !== true) return null;
    if (textMode === 'create') {
      const cleanDraft = Object.fromEntries(Object.entries(draft).filter(([, v]) => v !== ''));
      const { data } = await api.post('/official-texts', { ...cleanDraft, pageUrl: normalizeUrl(cleanDraft.pageUrl), relatesTo: relatesToIds });
      return data.id;
    }
    if (officialText) {
      try {
        const { data: detail } = await api.get(`/official-texts/${officialText.id}`);
        const existing = (detail.relatedObjects || []).map((o) => o.id);
        const merged = [...new Set([...existing, ...relatesToIds])];
        await api.patch(`/official-texts/${officialText.id}`, { relatesTo: merged });
      } catch { /*  */ }
      return officialText.id;
    }
    return null;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const relatesToIds = [...new Set([
      ...validRows.map((r) => r.person.id),
      ...validRows.map((r) => r.structure.id),
      ...allClosures.map((c) => c.resourceId).filter(Boolean),
    ])];

    let officialTextId = null;
    try {
      officialTextId = await resolveOfficialTextId(relatesToIds);
    } catch { notice(saveError); setSubmitting(false); return; }

    const relResults = await Promise.all(validRows.map((r) => api.post('/relations', {
      relatedObjectId: r.person.id,
      resourceId: r.structure.id,
      relationTag: GOUVERNANCE,
      relationTypeId: r.relType.id,
      startDate: r.startDate || defaultStartDate || undefined,
      endDate: r.endDate || undefined,
      endDatePrevisional: r.endDatePrevisional || defaultEndPrevisional || undefined,
      mandateReason: r.reason || undefined,
      mandateTemporary: r.temporary,
      mandatePrecision: r.precision || undefined,
      mandateEmail: r.email || undefined,
      personalEmail: r.personalEmail || undefined,
      mandatePhonenumber: r.phonenumber || undefined,
      startDateOfficialTextId: officialTextId || undefined,
    }).then(() => true).catch(() => false)));

    const closureResults = await Promise.all(allClosures.map((c) => api.patch(`/relations/${c.id}`, {
      resourceId: c.resourceId,
      relatedObjectId: c.relatedObjectId,
      endDate: c.endDate || defaultEndDate || getComparableNow(),
      endDateOfficialTextId: officialTextId || undefined,
    }).then(() => true).catch(() => false)));

    const failed = [...relResults, ...closureResults].filter((ok) => !ok).length;
    const total = relResults.length + closureResults.length;
    if (total > 0 && failed === total) { notice(saveError); setSubmitting(false); return; }
    if (failed > 0) {
      notice({ content: `${total - failed} action(s) enregistrée(s), ${failed} en échec.`, type: 'warning' });
    } else {
      notice(saveSuccess);
    }
    const firstPersonId = validRows.length > 0 ? validRows[0].person.id : null;
    handleReset();
    if (firstPersonId) navigate(`/personnes/${firstPersonId}/mandats`);
  };

  const toggleConcern = (key) => setConcerns((prev) => ({ ...prev, [key]: !prev[key] }));

  if (createOverlay) {
    return (
      <div>
        <div className="fr-mb-2w" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="fr-text--lead fr-mb-0">
            {createOverlay.kind === 'persons' ? 'Créer une personne absente de Paysage' : 'Créer une structure absente de Paysage'}
          </p>
          <Button secondary size="sm" icon="ri-arrow-left-line" iconPosition="left" onClick={closeCreateOverlay}>
            Retour à l&apos;assistant
          </Button>
        </div>
        {createOverlay.kind === 'persons'
          ? <PersonFlow onClose={closeCreateOverlay} onCreated={handleOverlayCreated} />
          : <StructureFlow onClose={closeCreateOverlay} onCreated={handleOverlayCreated} />}
      </div>
    );
  }

  return (
    <>
      <Row spacing="mb-2w">
        <Col n="12">
          <Stepper
            currentStep={step}
            steps={STEPS.length}
            currentTitle={STEPS[step - 1]}
            nextStepTitle={step < STEPS.length ? STEPS[step] : undefined}
          />
        </Col>
      </Row>

      {step === 1 && (
        <>
          <p className="fr-text--lead fr-mb-2w">Un texte juridique est-il associé ?</p>
          <RadioGroup isInline>
            <Radio label="Oui" onChange={() => setHasText(true)} checked={hasText === true} />
            <Radio label="Non" onChange={() => { setHasText(false); setOfficialText(null); }} checked={hasText === false} />
          </RadioGroup>

          {hasText === true && (
            <>
              <RadioGroup isInline className="fr-mt-2w">
                <Radio label="Rechercher un texte existant" onChange={() => setTextMode('search')} checked={textMode === 'search'} />
                <Radio label="Créer un nouveau texte" onChange={() => setTextMode('create')} checked={textMode === 'create'} />
              </RadioGroup>

              {textMode === 'search' && (
                <div className="fr-mt-2w">
                  {officialText ? (
                    <Row gutters alignItems="middle">
                      <Col><Tag icon="ri-git-repository-line" isSmall={false}>{officialText.name}</Tag></Col>
                      {officialText.pageUrl && (
                        <Col n="auto">
                          <Button
                            tertiary
                            borderless
                            size="sm"
                            icon="ri-external-link-line"
                            iconPosition="left"
                            onClick={() => window.open(officialText.pageUrl, '_blank')}
                          >
                            Voir le texte
                          </Button>
                        </Col>
                      )}
                      <Col n="auto">
                        <Button secondary size="sm" icon="ri-close-line" iconPosition="left" onClick={() => setOfficialText(null)}>Changer</Button>
                      </Col>
                    </Row>
                  ) : (
                    <SearchBar
                      buttonLabel="Rechercher"
                      label="Texte juridique"
                      hint="Rechercher un texte officiel existant dans Paysage"
                      placeholder="Rechercher un texte officiel…"
                      value={textQuery}
                      options={textOptions}
                      onChange={(e) => searchText(e.target.value)}
                      onSelect={handleSelectOfficialText}
                      isSearching={textSearching}
                      size="lg"
                    />
                  )}
                </div>
              )}

              {textMode === 'create' && (
                <Row gutters className="fr-mt-1w">
                  <Col n="12 md-6">
                    <Select
                      label="Nature"
                      required
                      options={OFFICIAL_TEXT_NATURE_OPTIONS}
                      selected={draft.nature}
                      onChange={(e) => setDraft((p) => ({ ...p, nature: e.target.value }))}
                      message={(showErrors && !draft.nature) ? 'Obligatoire' : null}
                      messageType={(showErrors && !draft.nature) ? 'error' : ''}
                    />
                  </Col>
                  <Col n="12 md-6">
                    <Select
                      label="Type"
                      required
                      options={OFFICIAL_TEXT_TYPE_OPTIONS}
                      selected={draft.type}
                      onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value }))}
                      message={(showErrors && !draft.type) ? 'Obligatoire' : null}
                      messageType={(showErrors && !draft.type) ? 'error' : ''}
                    />
                  </Col>
                  <Col n="12 md-6">
                    <TextInput
                      label="Numéro Jorftext"
                      hint="Uniquement si Publication au JO"
                      value={draft.jorftext}
                      onChange={(e) => setDraft((p) => ({ ...p, jorftext: e.target.value }))}
                    />
                  </Col>
                  <Col n="12 md-6">
                    <TextInput
                      label="Numéro NOR"
                      hint="Système normalisé de numérotation des textes officiels"
                      value={draft.nor}
                      onChange={(e) => setDraft((p) => ({ ...p, nor: e.target.value }))}
                    />
                  </Col>
                  <Col n="12">
                    <TextInput
                      label="Titre"
                      required
                      value={draft.title}
                      onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                      message={(showErrors && !draft.title.trim()) ? 'Obligatoire' : null}
                      messageType={(showErrors && !draft.title.trim()) ? 'error' : ''}
                    />
                  </Col>
                  <Col n="12">
                    <TextInput
                      label="URL"
                      required
                      value={draft.pageUrl}
                      onChange={(e) => setDraft((p) => ({ ...p, pageUrl: e.target.value }))}
                      message={(showErrors && !draft.pageUrl.trim()) ? 'Obligatoire' : null}
                      messageType={(showErrors && !draft.pageUrl.trim()) ? 'error' : ''}
                    />
                  </Col>
                  <Col n="12 md-6">
                    <DateInput
                      label="Date de publication"
                      value={draft.publicationDate}
                      onDateChange={(v) => setDraft((p) => ({ ...p, publicationDate: v }))}
                    />
                    {showErrors && !draft.publicationDate && <p className="fr-error-text fr-text--sm fr-mt-1v">Obligatoire</p>}
                  </Col>
                  <Col n="12 md-6">
                    <DateInput
                      label="Date de signature"
                      value={draft.signatureDate}
                      onDateChange={(v) => setDraft((p) => ({ ...p, signatureDate: v }))}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}

          {hasText !== null && (
            <Row gutters className="fr-mt-2w">
              <Col n="12 md-6">
                <DateInput
                  label="Date de début (par défaut)"
                  hint="Reprise pour chaque mandat, modifiable individuellement"
                  value={defaultStartDate}
                  onDateChange={setDefaultStartDate}
                />
              </Col>
              <Col n="12 md-6">
                <DateInput
                  label="Date de fin prévisionnelle (par défaut)"
                  hint="Reprise pour chaque mandat, modifiable individuellement"
                  value={defaultEndPrevisional}
                  onDateChange={setDefaultEndPrevisional}
                />
              </Col>
              <Col n="12 md-6">
                <DateInput
                  label="Date de fin (par défaut)"
                  hint="Optionnel — utilisée pour les clôtures de mandat"
                  value={defaultEndDate}
                  onDateChange={setDefaultEndDate}
                />
              </Col>
              <Col n="12 md-6">
                <DateInput
                  label="Date de publication"
                  value={draft.publicationDate}
                  onDateChange={(v) => setDraft((p) => ({ ...p, publicationDate: v }))}
                />
              </Col>
              <Col n="12 md-6">
                <DateInput
                  label="Date de signature"
                  value={draft.signatureDate}
                  onDateChange={(v) => setDraft((p) => ({ ...p, signatureDate: v }))}
                />
              </Col>
            </Row>
          )}

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col className="text-right">
              <Button
                icon="ri-arrow-right-line"
                iconPosition="right"
                onClick={handleNextFromText}
                disabled={hasText === null || (hasText === true && textMode === 'search' && !officialText)}
              >
                Suivant · Objets concernés
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 2 && (
        <>
          <p className="fr-text--lead fr-mb-1w">Que concerne cette contribution ?</p>
          <div className="fr-mb-2w">
            <Checkbox label="Des fonctions / mandats" checked={concerns.mandates} onChange={() => toggleConcern('mandates')} />
            <Checkbox label="Uniquement des fins de mandat" checked={concerns.closures} onChange={() => toggleConcern('closures')} />
          </div>

          {concerns.mandates && (
            <>
              <p className="fr-text--sm fr-text--bold fr-mb-1w">Mandats / fonctions</p>
              {rows.map((row, i) => (
                <MandateRow
                  key={row._key}
                  position={i + 1}
                  row={row}
                  allRelationTypes={allRelationTypes}
                  onPersonSelect={(person) => handleRowPersonSelect(row._key, person)}
                  onPersonUnselect={() => updateRow(row._key, { person: null, contactSuggestions: null })}
                  onRelTypeQuery={(q) => updateRow(row._key, { relTypeQuery: q, relType: null })}
                  onRelTypeSelect={(relType) => updateRow(row._key, { relType, relTypeQuery: '' })}
                  onRelTypeUnselect={() => updateRow(row._key, { relType: null, relTypeQuery: '' })}
                  onStructureSelect={(structure) => handleRowStructureSelect(row._key, structure)}
                  onStructureUnselect={() => updateRow(row._key, { structure: null, closureCandidates: [], closures: {} })}
                  onPersonRequestCreate={() => openCreateOverlay('persons', (entity) => handleRowPersonSelect(row._key, entity))}
                  onStructureRequestCreate={() => openCreateOverlay('structures', (entity) => handleRowStructureSelect(row._key, entity))}
                  onField={(field, value) => updateRow(row._key, { [field]: value })}
                  onToggleClosure={(relId) => updateRow(row._key, {
                    closures: (relId in (row.closures || {}))
                      ? Object.fromEntries(Object.entries(row.closures).filter(([k]) => k !== relId))
                      : { ...row.closures, [relId]: defaultStartDate || '' },
                  })}
                  onSetClosureDate={(relId, date) => updateRow(row._key, { closures: { ...row.closures, [relId]: date } })}
                  onFillContact={(field, value) => updateRow(row._key, { [field]: value })}
                  onRemove={() => handleRemoveRow(row._key)}
                  canRemove={rows.length > 1}
                  showErrors={showErrors}
                  defaultClosureDate={defaultStartDate}
                />
              ))}
              <Button secondary icon="ri-add-line" iconPosition="left" onClick={handleAddRow} className="fr-mb-3w">
                Ajouter un mandat
              </Button>
            </>
          )}

          {concerns.closures && (
            <>
              <p className="fr-text--sm fr-text--bold fr-mb-1w">Fins de mandat</p>
              {closureSections.map((sec) => (
                <div key={sec._key} className="fr-p-2w fr-mb-2w" style={{ border: '1px solid var(--grey-900-175)', borderRadius: '4px', background: 'white' }}>
                  <EntityField
                    type="structures"
                    label="Structure concernée"
                    selected={sec.structure}
                    onSelect={(structure) => handleClosureStructureSelect(sec._key, structure)}
                    onUnselect={() => updateClosureSection(sec._key, { structure: null, candidates: [], selected: {} })}
                    onRequestCreate={() => openCreateOverlay('structures', (entity) => handleClosureStructureSelect(sec._key, entity))}
                  />
                  {sec.structure && sec.candidates.length === 0 && (
                    <p className="fr-text--xs fr-hint-text fr-mt-1w">Aucun mandat en cours trouvé pour cette structure.</p>
                  )}
                  {sec.candidates.map((c) => (
                    <div key={c.id} style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexShrink: 0, cursor: 'pointer', fontSize: '13px' }}>
                          <input
                            type="checkbox"
                            checked={c.id in (sec.selected || {})}
                            onChange={() => updateClosureSection(sec._key, {
                              selected: (c.id in (sec.selected || {}))
                                ? Object.fromEntries(Object.entries(sec.selected).filter(([k]) => k !== c.id))
                                : { ...sec.selected, [c.id]: defaultEndDate || defaultStartDate || '' },
                            })}
                          />
                          Clôturer
                        </label>
                        <div style={{ flex: 1, border: '1px solid var(--grey-925-125)', borderRadius: '4px', padding: '8px 12px' }}>
                          <p className="fr-text--sm fr-mb-0"><strong>{c.personName}</strong></p>
                          {c.relTypeName && <p className="fr-text--xs fr-mb-0" style={{ color: 'var(--grey-425-625)' }}>{c.relTypeName}</p>}
                        </div>
                      </div>
                      {c.id in (sec.selected || {}) && (
                        <div style={{ marginTop: '4px', marginLeft: '80px' }}>
                          <DateInput
                            label="Date de fin"
                            hint="Laisser vide pour la date du jour"
                            value={sec.selected[c.id]}
                            onDateChange={(date) => updateClosureSection(sec._key, { selected: { ...sec.selected, [c.id]: date } })}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {closureSections.length > 1 && (
                    <Button className="fr-mt-1w" size="sm" tertiary borderless icon="ri-delete-bin-line" iconPosition="left" onClick={() => handleRemoveClosureSection(sec._key)}>
                      Retirer cette structure
                    </Button>
                  )}
                </div>
              ))}
              <Button secondary icon="ri-add-line" iconPosition="left" onClick={handleAddClosureSection} className="fr-mb-3w">
                Ajouter une structure
              </Button>
            </>
          )}

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(1)}>
                Retour · Texte juridique
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleGoToRecap}>
                Suivant · Récapitulatif
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 3 && (
        <>
          <p className="fr-text--lead fr-mb-2w">Récapitulatif avant enregistrement</p>
          <ul className="fr-mb-2w">
            {hasText === true && (
              <li>{textMode === 'create' ? `1 texte juridique à créer : ${draft.title}` : `1 texte juridique lié : ${officialText?.name}`}</li>
            )}
            {validRows.length > 0 && <li>{`${validRows.length} mandat${validRows.length > 1 ? 's' : ''} à créer`}</li>}
            {allClosures.length > 0 && <li>{`${allClosures.length} fermeture${allClosures.length > 1 ? 's' : ''} de mandat`}</li>}
          </ul>

          {validRows.map((r) => (
            <div key={r._key} className="fr-p-2w fr-mb-1w" style={{ border: '1px solid var(--grey-900-175)', borderRadius: '4px', background: 'white' }}>
              <p className="fr-text--sm fr-mb-0">
                <strong>{r.person.name}</strong>
                {` — ${r.relType.name} @ ${r.structure.name}`}
              </p>
              <p className="fr-text--xs fr-hint-text fr-mb-0">
                {r.startDate ? `À partir du ${r.startDate}` : 'Sans date de début'}
                {r.endDate ? ` · jusqu'au ${r.endDate}` : ''}
                {r.temporary ? ' · par intérim' : ''}
              </p>
            </div>
          ))}

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(2)} disabled={submitting}>
                Retour · Objets concernés
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-check-line" iconPosition="right" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Enregistrement…' : 'Valider et enregistrer'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

MandateFlow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
