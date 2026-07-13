import { useState } from 'react';
import {
  Col, Radio, RadioGroup, Row, Select, Stepper, Tag, TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../button';
import SearchBar from '../../search-bar';
import DateInput from '../../date-input';
import useNotice from '../../../hooks/useNotice';
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

  const handleSelectOfficialText = async (item) => {
    setOfficialText(item);
    setTextQuery('');
    setTextOptions([]);
    try {
      const { data } = await api.get(`/official-texts/${item.id}`);
      setOfficialText((prev) => ({ ...prev, pageUrl: data.pageUrl }));
    } catch { /* */ }
  };

  const addCited = (kind, entity) => {
    if (kind === 'structures') setCitedStructures((prev) => (prev.some((s) => s.id === entity.id) ? prev : [...prev, entity]));
    else setCitedPersons((prev) => (prev.some((p) => p.id === entity.id) ? prev : [...prev, entity]));
  };
  const removeCited = (kind, id) => {
    if (kind === 'structures') setCitedStructures((prev) => prev.filter((s) => s.id !== id));
    else setCitedPersons((prev) => prev.filter((p) => p.id !== id));
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

  const citedCount = citedStructures.length + citedPersons.length;

  const handleGoToRecap = () => {
    if (citedCount === 0) {
      notice({ content: 'Ajoutez au moins une personne ou une structure à citer.', type: 'error' });
      return;
    }
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setTextMode('create');
    setTextQuery(''); setTextOptions([]); setTextSearching(false); setOfficialText(null);
    setDraft(emptyDraft);
    setCitedStructures([]); setCitedPersons([]);
    setShowErrors(false); setSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const relatesToIds = [...new Set([
      ...citedStructures.map((s) => s.id),
      ...citedPersons.map((p) => p.id),
    ])];
    try {
      if (textMode === 'create') {
        await api.post('/official-texts', { ...draft, relatesTo: relatesToIds });
      } else {
        const { data: detail } = await api.get(`/official-texts/${officialText.id}`);
        const existing = (detail.relatedObjects || []).map((o) => o.id);
        const merged = [...new Set([...existing, ...relatesToIds])];
        await api.patch(`/official-texts/${officialText.id}`, { relatesTo: merged });
      }
    } catch { notice(saveError); setSubmitting(false); return; }
    notice(saveSuccess);
    handleReset();
  };

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
          <p className="fr-text--lead fr-mb-1w">Personnes et structures citées dans le texte</p>
          <p className="fr-text--xs fr-hint-text fr-mb-2w">
            Ajoutez les objets à lier au texte, sans notion de mandat. Créez-les s&apos;ils sont absents.
          </p>

          <div className="fr-mb-3w">
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Structures citées</p>
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
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Personnes citées</p>
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
          <ul className="fr-mb-2w">
            <li>{textMode === 'create' ? `1 texte officiel à créer : ${draft.title}` : `Texte officiel : ${officialText?.name}`}</li>
            {citedStructures.length > 0 && <li>{`${citedStructures.length} structure(s) liée(s)`}</li>}
            {citedPersons.length > 0 && <li>{`${citedPersons.length} personne(s) liée(s)`}</li>}
          </ul>

          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(2)} disabled={submitting}>
                Retour · Objets cités
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

OfficialTextFlow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
