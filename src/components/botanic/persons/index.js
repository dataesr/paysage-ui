import { useEffect, useMemo, useState } from 'react';
import { Col, Row, Stepper } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../../button';
import useFetch from '../../../hooks/useFetch';
import useDebounce from '../../../hooks/useDebounce';
import useEnums from '../../../hooks/useEnums';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import { getComparableNow } from '../../../utils/dates';
import { regexpValidateIdentifiers } from '../../../utils/regexpForIdentifiers';
import { PYDREF_GENDER, uid, sanitizeIdentifierValue } from '../utils';
import { usePersonExternalLookup } from '../use-external-lookup';
import { crossEnrichWikidataPersonByOrcid, crossEnrichWikidataPersonByIsni, crossEnrichWikidataPersonByIdRef } from '../external-lookup';
import EnrichmentPanel from '../enrichment-panel';
import useMandate from './hooks/use-mandate';
import PersonStep from './components/person-step';
import PersonSearchStep from './components/search-step';
import IdentifiersStep from './components/identifiers-step';
import FonctionStep from './components/fonction-step';
import SummaryBar from './components/summary-bar';

const isIdentifierValid = (type, value) => {
  if (!type || !value) return true;
  const [regexp] = regexpValidateIdentifiers(type);
  return !regexp || regexp.test(sanitizeIdentifierValue(type, value));
};

const extractIdentifierPairs = (identifiers) => {
  const pairs = [];
  (identifiers || []).forEach((idObj) => {
    Object.entries(idObj).forEach((entry) => pairs.push(entry));
  });
  return pairs;
};

const STEPS = ['Personne', 'Identifiants', 'Fonction'];

export default function PersonFlow({ onClose }) {
  const { notice } = useNotice();
  const enums = useEnums();
  const { data: relationTypesData } = useFetch('/relation-types?limit=500&filters[for]=persons');
  const allRelationTypes = useMemo(() => relationTypesData?.data || [], [relationTypesData]);
  const identifierOptions = (enums?.identifiers?.persons || [{ label: 'Sélectionner un type', value: '' }]).filter((o) => o.value !== 'ark');
  const socialMediaOptions = enums?.socialMedias || [{ label: 'Sélectionner un type', value: '' }];
  const navigate = useNavigate();

  const { mandate, on: mandateOn, apiPayload: mandatePayload, reset: resetMandate } = useMandate(allRelationTypes);

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [activity, setActivity] = useState('');
  const [existingPersonId, setExistingPersonId] = useState(undefined);
  const [paysageMatches, setPaysageMatches] = useState([]);
  const [personErrors, setPersonErrors] = useState({});
  const [showPersonErrors, setShowPersonErrors] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [personSearchQuery, setPersonSearchQuery] = useState('');
  const [personSearchOptions, setPersonSearchOptions] = useState([]);
  const [personSearching, setPersonSearching] = useState(false);
  const [selectedSearchPerson, setSelectedSearchPerson] = useState(null);

  const { pydrefLoading, pydrefMatches, wikidataLoading, wikidataMatches } = usePersonExternalLookup(firstName, lastName);
  const [selectedPydrefMatch, setSelectedPydrefMatch] = useState(null);
  const [selectedWikidataMatch, setSelectedWikidataMatch] = useState(null);

  const [identifiers, setIdentifiers] = useState([]);
  const [socialMedias, setSocialMedias] = useState([]);

  const [pastFunctions, setPastFunctions] = useState([]);
  const [pastContacts, setPastContacts] = useState({ emails: [], personalEmails: [], phones: [] });

  const [fonctionErrors, setFonctionErrors] = useState({});
  const [showFonctionErrors, setShowFonctionErrors] = useState(false);

  const debouncedFullName = useDebounce(`${firstName} ${lastName}`.trim(), 900);
  useEffect(() => {
    if (!firstName.trim() || !lastName.trim()) { setPaysageMatches([]); return; }
    const norm = (s) => (s || '').trim().toLowerCase();
    api.get(`/autocomplete?types=persons&query=${encodeURIComponent(debouncedFullName)}`)
      .then(({ data: res }) => {
        setPaysageMatches((res?.data || []).filter((el) => norm(el.name).includes(norm(debouncedFullName))));
      })
      .catch(() => setPaysageMatches([]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFullName]);

  useEffect(() => {
    if (typeof existingPersonId !== 'string') {
      setPastFunctions([]);
      setPastContacts({ emails: [], personalEmails: [], phones: [] });
      return;
    }
    let cancelled = false;
    api.get(`/relations?filters[relatedObjectId]=${existingPersonId}&filters[relationTag]=${GOUVERNANCE}&limit=500`)
      .then(({ data: res }) => {
        if (cancelled) return;
        const rels = res?.data || [];
        const byType = new Map();
        rels.forEach((rel) => {
          const id = rel.relationTypeId || rel.relationType?.id;
          const name = rel.relationType?.name;
          if (!id || !name) return;
          const isCurrent = rel.active !== false && (!rel.endDate || rel.endDate >= getComparableNow());
          const start = rel.startDate || '';
          const existing = byType.get(id);
          if (!existing) {
            byType.set(id, { id, name, isCurrent, latestStart: start });
          } else {
            existing.isCurrent = existing.isCurrent || isCurrent;
            if (start && (!existing.latestStart || start > existing.latestStart)) existing.latestStart = start;
          }
        });
        const sorted = [...byType.values()]
          .sort((a, b) => {
            if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
            return (b.latestStart || '').localeCompare(a.latestStart || '');
          })
          .slice(0, 10)
          .map(({ id, name, isCurrent }) => ({ id, name, isCurrent }));
        setPastFunctions(sorted);
        setPastContacts({
          emails: [...new Set(rels.map((r) => r.mandateEmail).filter(Boolean))],
          personalEmails: [...new Set(rels.map((r) => r.personalEmail).filter(Boolean))],
          phones: [...new Set(rels.map((r) => r.mandatePhonenumber).filter(Boolean))],
        });
      })
      .catch(() => {
        if (!cancelled) {
          setPastFunctions([]);
          setPastContacts({ emails: [], personalEmails: [], phones: [] });
        }
      });
    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; };
  }, [existingPersonId]);

  const handleAddIdentifier = () => setIdentifiers((prev) => [...prev, { _key: uid(), type: '', value: '' }]);
  const handleRemoveIdentifier = (key) => setIdentifiers((prev) => prev.filter((r) => r._key !== key));
  const handleChangeIdentifierType = (key, type) => setIdentifiers((prev) => prev.map((r) => (r._key === key ? { ...r, type } : r)));
  const handleChangeIdentifierValue = (key, value) => setIdentifiers((prev) => prev.map((r) => (r._key === key ? { ...r, value } : r)));

  const handleAddSocialMedia = () => setSocialMedias((prev) => [...prev, { _key: uid(), type: '', account: '' }]);
  const handleRemoveSocialMedia = (key) => setSocialMedias((prev) => prev.filter((r) => r._key !== key));
  const handleChangeSocialMediaType = (key, type) => setSocialMedias((prev) => prev.map((r) => (r._key === key ? { ...r, type } : r)));
  const handleChangeSocialMediaAccount = (key, account) => setSocialMedias((prev) => prev.map((r) => (r._key === key ? { ...r, account } : r)));

  const handleSelectPydrefMatch = async (match) => {
    setSelectedPydrefMatch(match);
    if (!match) {
      setIdentifiers((prev) => prev.filter((r) => !r.fromPydref && r.crossTrigger !== 'pydref'));
      return;
    }
    if (match.gender) setGender(PYDREF_GENDER[match.gender] || gender);
    if (match.birth_date) setBirthDate(match.birth_date.slice(0, 10));
    if (match.job) setActivity(match.job);

    const allPairs = extractIdentifierPairs(match.identifiers);
    setIdentifiers((prev) => {
      const manual = prev.filter((r) => !r.fromPydref && r.crossTrigger !== 'pydref');
      // Only block types already used by OTHER new identifiers (allow conflict with paysage existing ones)
      const usedNewTypes = new Set(manual.filter((r) => !r.fromExisting).map((r) => r.type).filter(Boolean));
      const fromPydref = allPairs
        .filter(([type]) => !usedNewTypes.has(type))
        .map(([type, value]) => ({ _key: uid(), type, value, fromPydref: true }));
      return [...fromPydref, ...manual];
    });

    const orcid = allPairs.find(([type]) => type === 'orcid')?.[1];
    const isni = allPairs.find(([type]) => type === 'isni')?.[1];
    const idref = allPairs.find(([type]) => type === 'idref')?.[1];
    let wdResult = null;
    if (orcid) wdResult = await crossEnrichWikidataPersonByOrcid(orcid).catch(() => null);
    else if (isni) wdResult = await crossEnrichWikidataPersonByIsni(isni).catch(() => null);
    else if (idref) wdResult = await crossEnrichWikidataPersonByIdRef(idref).catch(() => null);
    if (wdResult) {
      setIdentifiers((prev) => {
        const usedNewTypes = new Set(prev.filter((r) => r.type && !r.fromExisting).map((r) => r.type));
        const extra = (wdResult.identifiers || [])
          .filter(({ type, value }) => !usedNewTypes.has(type) && isIdentifierValid(type, value))
          .map(({ type, value }) => ({ _key: uid(), type, value, fromWikidata: true, via: 'Pydref', crossTrigger: 'pydref' }));
        return [...prev, ...extra];
      });
    }
  };

  const handleSelectWikidataMatch = (match) => {
    setSelectedWikidataMatch(match);
    if (!match) {
      setIdentifiers((prev) => prev.filter((r) => !r.fromWikidata));
      setSocialMedias((prev) => prev.filter((r) => !r.fromWikidata));
      return;
    }
    if (match.gender && !gender) setGender(match.gender);
    if (match.birthDate && !birthDate) setBirthDate(match.birthDate);
    if (match.description && !activity) setActivity(match.description);
    setIdentifiers((prev) => {
      const without = prev.filter((r) => !r.fromWikidata);
      // Only block types already used by OTHER new identifiers (allow conflict with paysage existing ones)
      const usedNewTypes = new Set(without.filter((r) => r.type && !r.fromExisting).map((r) => r.type));
      const fromWikidata = (match.identifiers || [])
        .filter(({ type, value }) => !usedNewTypes.has(type) && isIdentifierValid(type, value))
        .map(({ type, value }) => ({ _key: uid(), type, value, fromWikidata: true }));
      return [...without, ...fromWikidata];
    });
    setSocialMedias((prev) => {
      const without = prev.filter((r) => !r.fromWikidata);
      const usedTypes = new Set(without.filter((r) => r.type).map((r) => r.type));
      const fromWikidata = (match.socialMedias || [])
        .filter(({ type }) => !usedTypes.has(type))
        .map(({ type, account }) => ({ _key: uid(), type, account, fromWikidata: true }));
      return [...without, ...fromWikidata];
    });
  };

  const handleNameChange = (field, value) => {
    if (field === 'firstName') setFirstName(value); else setLastName(value);
    setExistingPersonId(undefined);
    setSelectedPydrefMatch(null);
    setSelectedWikidataMatch(null);
    setPaysageMatches([]);
  };

  const hasDuplicate = paysageMatches.length > 0 && existingPersonId === undefined;

  const handleNextFromPerson = () => {
    if (hasDuplicate) return;
    if (!existingPersonId) {
      const errs = {};
      if (!firstName.trim()) errs.firstName = 'Le prénom est obligatoire.';
      if (!lastName.trim()) errs.lastName = 'Le nom est obligatoire.';
      if (!gender) errs.gender = 'Le genre est obligatoire.';
      if (Object.keys(errs).length > 0) { setPersonErrors(errs); setShowPersonErrors(true); return; }
    }
    setPersonErrors({});
    setShowPersonErrors(false);
    const loadThenNext = async () => {
      if (typeof existingPersonId === 'string' && identifiers.filter((r) => r.fromExisting).length === 0) {
        try {
          const { data: res } = await api.get(`/persons/${existingPersonId}/identifiers?limit=100`);
          const existing = (res?.data || []).map((id) => ({
            _key: uid(), type: id.type, value: id.value, originalValue: id.value, originalType: id.type, fromExisting: true,
          }));
          const existingTypes = new Set(existing.map((r) => r.type));
          setIdentifiers((prev) => [...existing, ...prev.filter((r) => !r.fromExisting && !existingTypes.has(r.type))]);
        } catch { /* keep current */ }
      }
      setStep(2);
    };
    loadThenNext();
  };

  const handleNextFromIdentifiers = () => {
    const hasInvalid = identifiers.some((r) => {
      if (!r.type || !r.value || r.fromWikidata || r.fromPydref) return false;
      return !isIdentifierValid(r.type, r.value);
    });
    if (hasInvalid) {
      notice({ content: 'Un ou plusieurs identifiants saisis sont invalides.', type: 'error' });
      return;
    }
    setStep(3);
  };

  const handlePersonSearchQuery = async (q) => {
    setPersonSearchQuery(q);
    if (!q || q.length < 2) { setPersonSearchOptions([]); return; }
    setPersonSearching(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=persons&query=${encodeURIComponent(q)}`);
      setPersonSearchOptions(res?.data || []);
    } catch { setPersonSearchOptions([]); }
    setPersonSearching(false);
  };

  const handleSelectSearchPerson = async (person) => {
    setSelectedSearchPerson(person);
    setExistingPersonId(person.id);
    setPersonSearchQuery('');
    setPersonSearchOptions([]);
    try {
      const [{ data }, { data: idData }] = await Promise.all([
        api.get(`/persons/${person.id}`),
        api.get(`/persons/${person.id}/identifiers?limit=100`),
      ]);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      if (data.gender) setGender(data.gender);
      if (data.birthDate) setBirthDate(data.birthDate);
      if (data.activity) setActivity(data.activity);
      setIdentifiers((idData?.data || []).map((id) => ({
        _key: uid(), type: id.type, value: id.value, originalValue: id.value, originalType: id.type, fromExisting: true,
      })));
    } catch {
      const parts = person.name.trim().split(' ');
      setFirstName(parts.slice(0, -1).join(' '));
      setLastName(parts[parts.length - 1] || person.name);
    }
  };

  const handleUnselectSearchPerson = () => {
    setSelectedSearchPerson(null);
    setExistingPersonId(undefined);
    setFirstName(''); setLastName(''); setGender(''); setBirthDate(''); setActivity('');
    setPersonSearchQuery(''); setPersonSearchOptions([]);
    setIdentifiers([]); setSelectedPydrefMatch(null); setSelectedWikidataMatch(null);
  };

  const handleBackFromCreate = () => {
    setIsCreatingNew(false);
    setFirstName(''); setLastName(''); setGender('');
    setPersonErrors({}); setShowPersonErrors(false);
    setExistingPersonId(undefined); setBirthDate(''); setActivity('');
    setSelectedPydrefMatch(null); setSelectedWikidataMatch(null);
    setPaysageMatches([]);
  };

  const handleSubmit = async () => {
    const { relType, structure } = mandate;
    if (!relType.selected) {
      setFonctionErrors({ relTypeId: 'Veuillez choisir un type de mandat.' });
      setShowFonctionErrors(true);
      return;
    }
    if (!structure.selected) {
      notice({ content: 'Veuillez choisir une structure.', type: 'error' });
      return;
    }
    setFonctionErrors({});
    setShowFonctionErrors(false);

    let personId = existingPersonId || null;
    if (!personId) {
      try {
        const { data } = await api.post('/persons', {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
          ...(birthDate ? { birthDate } : {}),
          ...(activity ? { activity } : {}),
        });
        personId = data.id;
      } catch { notice(saveError); return; }
    }

    const newIdentifiers = identifiers.filter((r) => {
      if (!r.type || !r.value || r.type === 'ark') return false;
      if (r.fromExisting && r.value === r.originalValue && r.type === r.originalType) return false;
      const [regexp] = regexpValidateIdentifiers(r.type);
      return !regexp || regexp.test(sanitizeIdentifierValue(r.type, r.value));
    });
    if (newIdentifiers.length > 0) {
      await Promise.all(newIdentifiers.map((r) => api.post(`/persons/${personId}/identifiers`, {
        type: r.type, value: sanitizeIdentifierValue(r.type, r.value), active: true,
      }).catch(() => null)));
    }

    const newSocialMedias = socialMedias.filter((r) => r.type && r.account);
    if (newSocialMedias.length > 0) {
      await Promise.all(newSocialMedias.map((r) => {
        const account = r.account.startsWith('https://') ? r.account : `https://${r.account}`;
        return api.post(`/persons/${personId}/social-medias`, { type: r.type, account }).catch(() => null);
      }));
    }

    const toClose = mandate.conflicts.filter((m) => m.id in mandate.conflictsToClose);
    if (toClose.length > 0) {
      await Promise.all(toClose.map((m) => api.patch(`/relations/${m.id}`, {
        resourceId: m.resourceId,
        relatedObjectId: m.relatedObjectId,
        endDate: mandate.conflictsToClose[m.id] || getComparableNow(),
      }).catch(() => null)));
    }

    try {
      await api.post('/relations', {
        relatedObjectId: personId,
        resourceId: structure.selected.id,
        relationTag: GOUVERNANCE,
        relationTypeId: relType.selected.id,
        ...mandatePayload,
      });
    } catch { notice(saveError); return; }

    notice(saveSuccess);
    handleReset(); // eslint-disable-line no-use-before-define
    navigate(`/personnes/${personId}`);
  };

  const handleReset = () => {
    setStep(1);
    setFirstName(''); setLastName(''); setGender(''); setBirthDate(''); setActivity('');
    setExistingPersonId(undefined); setPaysageMatches([]);
    setPersonErrors({}); setShowPersonErrors(false);
    setIsCreatingNew(false);
    setPersonSearchQuery(''); setPersonSearchOptions([]); setPersonSearching(false);
    setSelectedSearchPerson(null);
    setSelectedPydrefMatch(null); setSelectedWikidataMatch(null);
    setIdentifiers([]); setSocialMedias([]);
    setPastFunctions([]);
    setPastContacts({ emails: [], personalEmails: [], phones: [] });
    setFonctionErrors({}); setShowFonctionErrors(false);
    resetMandate();
    onClose();
  };

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

      <SummaryBar
        step={step}
        firstName={firstName}
        lastName={lastName}
        existingPersonId={existingPersonId}
        selectedRelationType={mandate.relType.selected}
        startDate={mandate.startDate}
        selectedStructure={mandate.structure.selected}
      />

      {step === 1 && (
        <>
          {!isCreatingNew ? (
            <>
              <PersonSearchStep
                query={personSearchQuery}
                setQuery={handlePersonSearchQuery}
                options={personSearchOptions}
                isSearching={personSearching}
                selectedPerson={selectedSearchPerson}
                onSelect={handleSelectSearchPerson}
                onUnselect={handleUnselectSearchPerson}
                onChooseCreate={() => setIsCreatingNew(true)}
              />
              {selectedSearchPerson && (
                <EnrichmentPanel
                  pydrefLoading={pydrefLoading}
                  pydrefMatches={pydrefMatches}
                  selectedPydrefMatch={selectedPydrefMatch}
                  onSelectPydref={handleSelectPydrefMatch}
                  wikidataLoading={wikidataLoading}
                  wikidataMatches={wikidataMatches}
                  selectedWikidataMatch={selectedWikidataMatch}
                  onSelectWikidata={handleSelectWikidataMatch}
                  entityType="person"
                />
              )}
            </>
          ) : (
            <>
              <PersonStep
                firstName={firstName}
                lastName={lastName}
                gender={gender}
                onFirstNameChange={(v) => handleNameChange('firstName', v)}
                onLastNameChange={(v) => handleNameChange('lastName', v)}
                onGenderChange={setGender}
                errors={personErrors}
                showErrors={showPersonErrors}
                paysageMatches={paysageMatches}
                existingPersonId={existingPersonId}
                onUseExisting={setExistingPersonId}
                onKeepNew={() => setExistingPersonId(null)}
                birthDate={birthDate}
                onBirthDateChange={setBirthDate}
                activity={activity}
                onActivityChange={setActivity}
              />
              {!hasDuplicate && (
                <EnrichmentPanel
                  pydrefLoading={pydrefLoading}
                  pydrefMatches={pydrefMatches}
                  selectedPydrefMatch={selectedPydrefMatch}
                  onSelectPydref={handleSelectPydrefMatch}
                  wikidataLoading={wikidataLoading}
                  wikidataMatches={wikidataMatches}
                  selectedWikidataMatch={selectedWikidataMatch}
                  onSelectWikidata={handleSelectWikidataMatch}
                  entityType="person"
                />
              )}
            </>
          )}
          <Row justifyContent="right" spacing="mt-3w" gutters>
            {isCreatingNew && (
              <Col>
                <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={handleBackFromCreate}>
                  Retour
                </Button>
              </Col>
            )}
            {isCreatingNew && hasDuplicate && (
              <Col n="12">
                <p className="fr-text--sm fr-hint-text fr-mb-1w">
                  Sélectionnez une fiche existante ou confirmez la création d&apos;une nouvelle fiche.
                </p>
              </Col>
            )}
            <Col className="text-right">
              <Button
                icon="ri-arrow-right-line"
                iconPosition="right"
                onClick={handleNextFromPerson}
                disabled={(!isCreatingNew && !selectedSearchPerson) || (isCreatingNew && hasDuplicate)}
              >
                Suivant · Identifiants
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 2 && (
        <>
          <IdentifiersStep
            identifiers={identifiers}
            identifierOptions={identifierOptions}
            onAdd={handleAddIdentifier}
            onRemove={handleRemoveIdentifier}
            onChangeType={handleChangeIdentifierType}
            onChangeValue={handleChangeIdentifierValue}
            isExisting={typeof existingPersonId === 'string'}
            existingPersonName={[firstName, lastName].filter(Boolean).join(' ') || null}
            socialMedias={socialMedias}
            socialMediaOptions={socialMediaOptions}
            onAddSocialMedia={handleAddSocialMedia}
            onRemoveSocialMedia={handleRemoveSocialMedia}
            onChangeSocialMediaType={handleChangeSocialMediaType}
            onChangeSocialMediaAccount={handleChangeSocialMediaAccount}
          />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(1)}>
                Retour · Personne
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleNextFromIdentifiers}>
                Suivant · Fonction
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 3 && (
        <>
          <FonctionStep
            pastFunctions={pastFunctions}
            pastContacts={pastContacts}
            mandate={mandate}
            on={mandateOn}
            errors={fonctionErrors}
            showErrors={showFonctionErrors}
          />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(2)}>
                Retour · Identifiants
              </Button>
            </Col>
            <Col className="text-right">
              <Button
                icon="ri-save-line"
                iconPosition="left"
                onClick={handleSubmit}
                disabled={!mandate.structure.selected || !mandate.relType.selected}
              >
                {typeof existingPersonId === 'string' ? 'Enregistrer le mandat' : 'Créer la fiche et le mandat'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

PersonFlow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
