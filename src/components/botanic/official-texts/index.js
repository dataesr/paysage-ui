import { useState } from 'react';
import {
  Col, Radio, RadioGroup, Row, Select, Stepper, Tag, TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../../button';
import SearchBar from '../../search-bar';
import DateInput from '../../date-input';
import useNotice from '../../../hooks/useNotice';
import useSubmitGuard from '../../../hooks/useSubmitGuard';
import api from '../../../utils/api';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import { OFFICIAL_TEXT_NATURE_OPTIONS, OFFICIAL_TEXT_TYPE_OPTIONS } from '../utils';
import EntityField from '../mandates/components/entity-field';
import PersonFlow from '../persons';
import StructureFlow from '../structures';

const STEPS = ['Texte officiel', 'Objets cités', 'Récapitulatif'];

const emptyDraft = {
  nature: '',
  type: '',
  jorftext: '',
  nor: '',
  title: '',
  pageUrl: '',
  publicationDate: '',
  signatureDate: '',
  startDate: '',
  endDate: '',
  previsionalEndDate: '',
};

export default function OfficialTextFlow({ onClose }) {
  const { notice } = useNotice();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [textMode, setTextMode] = useState('create'); // 'search' | 'create'
  const [textQuery, setTextQuery] = useState('');
  const [textOptions, setTextOptions] = useState([]);
  const [textSearching, setTextSearching] = useState(false);
  const [officialText, setOfficialText] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const [citedStructures, setCitedStructures] = useState([]);
  const [citedPersons, setCitedPersons] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(null); // { kind, apply }

  const [existingCited, setExistingCited] = useState([]);
  const [citedCategories, setCitedCategories] = useState([]);
  const [citedTerms, setCitedTerms] = useState([]);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categorySearching, setCategorySearching] = useState(false);
  const [termQuery, setTermQuery] = useState('');
  const [termOptions, setTermOptions] = useState([]);
  const [termSearching, setTermSearching] = useState(false);

  const openCreateOverlay = (kind, apply) => setCreateOverlay({ kind, apply });
  const closeCreateOverlay = () => setCreateOverlay(null);
  const handleOverlayCreated = (entity) => {
    if (createOverlay?.apply) createOverlay.apply(entity);
    setCreateOverlay(null);
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

  const searchCategory = async (q) => {
    setCategoryQuery(q);
    if (!q || q.length < 2) { setCategoryOptions([]); return; }
    setCategorySearching(true);
    try {
      const { data } = await api.get(`/autocomplete?types=categories&query=${encodeURIComponent(q)}`);
      setCategoryOptions(data?.data || []);
    } catch { setCategoryOptions([]); }
    setCategorySearching(false);
  };

  const searchTerm = async (q) => {
    setTermQuery(q);
    if (!q || q.length < 2) { setTermOptions([]); return; }
    setTermSearching(true);
    try {
      const { data } = await api.get(`/autocomplete?types=terms&query=${encodeURIComponent(q)}`);
      setTermOptions(data?.data || []);
    } catch { setTermOptions([]); }
    setTermSearching(false);
  };

  const handleSelectOfficialText = async (item) => {
    setOfficialText(item);
    setTextQuery('');
    setTextOptions([]);
    setExistingCited([]);
    try {
      const { data } = await api.get(`/official-texts/${item.id}`);
      setOfficialText((prev) => ({ ...prev, pageUrl: data.pageUrl }));
      if (data.relatedObjects?.length) {
        setExistingCited(data.relatedObjects.map((o) => ({ id: o.id, name: o.displayName || o.id })));
      }
    } catch { /* */ }
  };

  const addCited = (kind, entity) => {
    if (kind === 'structures') setCitedStructures((prev) => (prev.some((s) => s.id === entity.id) ? prev : [...prev, entity]));
    else if (kind === 'persons') setCitedPersons((prev) => (prev.some((p) => p.id === entity.id) ? prev : [...prev, entity]));
    else if (kind === 'categories') setCitedCategories((prev) => (prev.some((c) => c.id === entity.id) ? prev : [...prev, entity]));
    else setCitedTerms((prev) => (prev.some((t) => t.id === entity.id) ? prev : [...prev, entity]));
  };
  const removeCited = (kind, id) => {
    if (kind === 'structures') setCitedStructures((prev) => prev.filter((s) => s.id !== id));
    else if (kind === 'persons') setCitedPersons((prev) => prev.filter((p) => p.id !== id));
    else if (kind === 'categories') setCitedCategories((prev) => prev.filter((c) => c.id !== id));
    else setCitedTerms((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNextFromText = () => {
    if (textMode === 'create') {
      if (!draft.nature || !draft.type || !draft.title.trim() || !draft.pageUrl.trim() || !draft.publicationDate) {
        setShowErrors(true);
        notice({ content: 'Complétez les champs obligatoires du texte officiel.', type: 'error' });
        return;
      }
    } else if (!officialText) {
      notice({ content: 'Sélectionnez un texte officiel.', type: 'error' });
      return;
    }
    setShowErrors(false);
    setStep(2);
  };

  const citedCount = citedStructures.length + citedPersons.length + citedCategories.length + citedTerms.length;

  const handleGoToRecap = () => {
    if (textMode === 'create' && citedCount === 0) {
      notice({ content: 'Ajoutez au moins un objet à citer (personne, structure, catégorie ou terme).', type: 'error' });
      return;
    }
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setTextMode('create');
    setTextQuery(''); setTextOptions([]); setTextSearching(false); setOfficialText(null);
    setDraft(emptyDraft);
    setCitedStructures([]); setCitedPersons([]); setCitedCategories([]); setCitedTerms([]);
    setExistingCited([]);
    setCategoryQuery(''); setCategoryOptions([]); setCategorySearching(false);
    setTermQuery(''); setTermOptions([]); setTermSearching(false);
    setShowErrors(false); setSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const relatesToIds = [...new Set([
      ...citedStructures.map((s) => s.id),
      ...citedPersons.map((p) => p.id),
      ...citedCategories.map((c) => c.id),
      ...citedTerms.map((t) => t.id),
    ])];
    let savedId = null;
    const normalizeUrl = (url) => (url && !url.match(/^https?:\/\//) ? `https://${url}` : url);
    const cleanDraft = Object.fromEntries(Object.entries(draft).filter(([, v]) => v !== ''));
    try {
      if (textMode === 'create') {
        const { data } = await api.post('/official-texts', { ...cleanDraft, pageUrl: normalizeUrl(cleanDraft.pageUrl), relatesTo: relatesToIds });
        savedId = data.id;
      } else {
        savedId = officialText.id;
        const { data: detail } = await api.get(`/official-texts/${officialText.id}`);
        const existing = (detail.relatedObjects || []).map((o) => o.id);
        const merged = [...new Set([...existing, ...relatesToIds])];
        await api.patch(`/official-texts/${officialText.id}`, { relatesTo: merged });
      }
    } catch { notice(saveError); setSubmitting(false); return; }
    notice(saveSuccess);
    handleReset();
    if (savedId) navigate(`/textes-officiels/${savedId}`);
  };
  const guardedSubmit = useSubmitGuard(handleSubmit);

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
          <RadioGroup isInline>
            <Radio label="Créer un nouveau texte" onChange={() => setTextMode('create')} checked={textMode === 'create'} />
            <Radio label="Rechercher un texte existant" onChange={() => setTextMode('search')} checked={textMode === 'search'} />
          </RadioGroup>

          {textMode === 'search' && (
            <div className="fr-mt-2w">
              {officialText ? (
                <Row gutters alignItems="middle">
                  <Col><Tag icon="ri-git-repository-line" isSmall={false}>{officialText.name}</Tag></Col>
                  {officialText.pageUrl && (
                    <Col n="auto">
                      <Button tertiary borderless size="sm" icon="ri-external-link-line" iconPosition="left" onClick={() => window.open(officialText.pageUrl, '_blank')}>
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
                  label="Texte officiel"
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
              <Col n="12 md-4">
                <DateInput
                  label="Date de début"
                  value={draft.startDate}
                  onDateChange={(v) => setDraft((p) => ({ ...p, startDate: v }))}
                />
              </Col>
              <Col n="12 md-4">
                <DateInput
                  label="Date de fin"
                  value={draft.endDate}
                  onDateChange={(v) => setDraft((p) => ({ ...p, endDate: v }))}
                />
              </Col>
              <Col n="12 md-4">
                <DateInput
                  label="Date de fin prévisionnelle"
                  value={draft.previsionalEndDate}
                  onDateChange={(v) => setDraft((p) => ({ ...p, previsionalEndDate: v }))}
                />
              </Col>
            </Row>
          )}

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col className="text-right">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleNextFromText}>
                Suivant · Objets cités
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 2 && (
        <>
          <p className="fr-text--lead fr-mb-1w">Objets cités dans le texte</p>
          <p className="fr-text--xs fr-hint-text fr-mb-2w">
            Ajoutez les objets à lier au texte. Créez-les s&apos;ils sont absents.
          </p>

          {existingCited.length > 0 && (
            <div className="fr-mb-3w">
              <p className="fr-text--sm fr-text--bold fr-mb-1w">Déjà liés</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {existingCited.map((o) => (
                  <Tag key={o.id}>{o.name}</Tag>
                ))}
              </div>
            </div>
          )}

          <div className="fr-mb-3w">
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Structures</p>
            {citedStructures.length > 0 && (
              <div className="fr-mb-1w" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {citedStructures.map((s) => (
                  <Tag key={s.id} onClick={() => removeCited('structures', s.id)} icon="ri-close-line">{s.name}</Tag>
                ))}
              </div>
            )}
            <EntityField
              type="structures"
              label="Ajouter une structure"
              selected={null}
              onSelect={(s) => addCited('structures', s)}
              onUnselect={() => {}}
              onRequestCreate={() => openCreateOverlay('structures', (entity) => addCited('structures', entity))}
            />
          </div>

          <div className="fr-mb-3w">
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Personnes</p>
            {citedPersons.length > 0 && (
              <div className="fr-mb-1w" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {citedPersons.map((p) => (
                  <Tag key={p.id} onClick={() => removeCited('persons', p.id)} icon="ri-close-line">{p.name}</Tag>
                ))}
              </div>
            )}
            <EntityField
              type="persons"
              label="Ajouter une personne"
              selected={null}
              onSelect={(p) => addCited('persons', p)}
              onUnselect={() => {}}
              onRequestCreate={() => openCreateOverlay('persons', (entity) => addCited('persons', entity))}
            />
          </div>

          <div className="fr-mb-3w">
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Catégories</p>
            {citedCategories.length > 0 && (
              <div className="fr-mb-1w" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {citedCategories.map((c) => (
                  <Tag key={c.id} onClick={() => removeCited('categories', c.id)} icon="ri-close-line">{c.name}</Tag>
                ))}
              </div>
            )}
            <SearchBar
              buttonLabel="Rechercher"
              label="Ajouter une catégorie"
              placeholder="Rechercher une catégorie…"
              value={categoryQuery}
              options={categoryOptions}
              onChange={(e) => searchCategory(e.target.value)}
              onSelect={(item) => { addCited('categories', item); setCategoryQuery(''); setCategoryOptions([]); }}
              isSearching={categorySearching}
            />
          </div>

          <div className="fr-mb-3w">
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Termes</p>
            {citedTerms.length > 0 && (
              <div className="fr-mb-1w" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {citedTerms.map((t) => (
                  <Tag key={t.id} onClick={() => removeCited('terms', t.id)} icon="ri-close-line">{t.name}</Tag>
                ))}
              </div>
            )}
            <SearchBar
              buttonLabel="Rechercher"
              label="Ajouter un terme"
              placeholder="Rechercher un terme…"
              value={termQuery}
              options={termOptions}
              onChange={(e) => searchTerm(e.target.value)}
              onSelect={(item) => { addCited('terms', item); setTermQuery(''); setTermOptions([]); }}
              isSearching={termSearching}
            />
          </div>

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(1)}>
                Retour · Texte officiel
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

          <div className="fr-mb-2w fr-p-2w" style={{ border: '1px solid var(--grey-900-175)', background: 'var(--grey-900-175)' }}>
            <p className="fr-text--sm fr-text--bold fr-mb-1v">Texte officiel</p>
            <p className="fr-text--sm fr-mb-0">
              {textMode === 'create' ? `À créer : ${draft.title}` : `Existant : ${officialText?.name}`}
            </p>
          </div>

          {existingCited.length > 0 && (
            <div className="fr-mb-2w">
              <p className="fr-text--sm fr-text--bold fr-mb-1v">{`Objets déjà liés (${existingCited.length})`}</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {existingCited.map((o) => <li key={o.id} className="fr-text--sm">{o.name}</li>)}
              </ul>
            </div>
          )}

          {citedStructures.length > 0 && (
            <div className="fr-mb-2w">
              <p className="fr-text--sm fr-text--bold fr-mb-1v">{`Structures à lier (${citedStructures.length})`}</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {citedStructures.map((s) => <li key={s.id} className="fr-text--sm">{s.name}</li>)}
              </ul>
            </div>
          )}

          {citedPersons.length > 0 && (
            <div className="fr-mb-2w">
              <p className="fr-text--sm fr-text--bold fr-mb-1v">{`Personnes à lier (${citedPersons.length})`}</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {citedPersons.map((p) => <li key={p.id} className="fr-text--sm">{p.name}</li>)}
              </ul>
            </div>
          )}

          {citedCategories.length > 0 && (
            <div className="fr-mb-2w">
              <p className="fr-text--sm fr-text--bold fr-mb-1v">{`Catégories à lier (${citedCategories.length})`}</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {citedCategories.map((c) => <li key={c.id} className="fr-text--sm">{c.name}</li>)}
              </ul>
            </div>
          )}

          {citedTerms.length > 0 && (
            <div className="fr-mb-2w">
              <p className="fr-text--sm fr-text--bold fr-mb-1v">{`Termes à lier (${citedTerms.length})`}</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {citedTerms.map((t) => <li key={t.id} className="fr-text--sm">{t.name}</li>)}
              </ul>
            </div>
          )}

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(2)} disabled={submitting}>
                Retour · Objets cités
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-check-line" iconPosition="right" onClick={guardedSubmit} disabled={submitting}>
                {submitting ? 'Enregistrement…' : 'Valider et enregistrer'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

OfficialTextFlow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
