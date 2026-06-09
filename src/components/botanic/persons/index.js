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
import PersonStep from './components/person-step';
import PersonSearchStep from './components/search-step';
import IdentifiersStep from './components/identifiers-step';
import FonctionStep from './components/fonction-step';
import StructureRelationStep from './components/structure-step';
import SummaryBar from './components/summary-bar';

const datesOverlap = (mStart, mEnd, newStart, newEnd) => {
  if (mEnd && newStart && mEnd < newStart) return false;
  if (mStart && newEnd && mStart > newEnd) return false;
  return true;
};

const STEPS = ['Personne', 'Identifiants', 'Fonction', 'Structure'];

export default function PersonFlow({ onClose }) {
  const { notice } = useNotice();
  const enums = useEnums();
  const { data: relationTypesData } = useFetch('/relation-types?limit=500&filters[for]=persons');
  const allRelationTypes = useMemo(() => relationTypesData?.data || [], [relationTypesData]);
  const identifierOptions = (enums?.identifiers?.persons || [{ label: 'Sélectionner un type', value: '' }]).filter((o) => o.value !== 'ark');
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [personErrors, setPersonErrors] = useState({});
  const [showPersonErrors, setShowPersonErrors] = useState(false);
  const [existingPersonId, setExistingPersonId] = useState(undefined);
  const [paysageMatches, setPaysageMatches] = useState([]);
  const [birthDate, setBirthDate] = useState('');
  const [activity, setActivity] = useState('');

  const { pydrefLoading, pydrefMatches, wikidataLoading, wikidataMatches } = usePersonExternalLookup(firstName, lastName);
  const [selectedPydrefMatch, setSelectedPydrefMatch] = useState(null);
  const [selectedWikidataMatch, setSelectedWikidataMatch] = useState(null);

  const [identifiers, setIdentifiers] = useState([]);
  const [socialMedias, setSocialMedias] = useState([]);
  const socialMediaOptions = enums?.socialMedias || [{ label: 'Sélectionner un type', value: '' }];

  const [relationTypeQuery, setRelationTypeQuery] = useState('');
  const [relationTypeOptions, setRelationTypeOptions] = useState([]);
  const [selectedRelationType, setSelectedRelationType] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fonctionErrors, setFonctionErrors] = useState({});
  const [showFonctionErrors, setShowFonctionErrors] = useState(false);

  const [structureQuery, setStructureQuery] = useState('');
  const [structureOptions, setStructureOptions] = useState([]);
  const [isSearchingStructure, setIsSearchingStructure] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [activeRelations, setActiveRelations] = useState([]);
  const [conflictsToClose, setConflictsToClose] = useState({});

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [personSearchQuery, setPersonSearchQuery] = useState('');
  const [personSearchOptions, setPersonSearchOptions] = useState([]);
  const [isSearchingPerson, setIsSearchingPerson] = useState(false);
  const [selectedSearchPerson, setSelectedSearchPerson] = useState(null);

  const relatedConflicts = useMemo(() => {
    if (!selectedRelationType || !activeRelations.length) return [];
    const newStart = startDate || null;
    const newEnd = endDate || null;
    return activeRelations.filter(
      (m) => (m.relationTypeId === selectedRelationType.id || m.relationType?.id === selectedRelationType.id)
        && datesOverlap(m.startDate, m.endDate, newStart, newEnd),
    );
  }, [activeRelations, selectedRelationType, startDate, endDate]);

  useEffect(() => {
    setConflictsToClose(Object.fromEntries(relatedConflicts.map((m) => [m.id, ''])));
  }, [relatedConflicts]);

  const fullName = `${firstName} ${lastName}`.trim();
  const debouncedFullName = useDebounce(fullName, 900);

  useEffect(() => {
    if (!firstName.trim() || !lastName.trim()) { setPaysageMatches([]); return; }
    const checkPaysage = async () => {
      try {
        const { data: res } = await api.get(`/autocomplete?types=persons&query=${encodeURIComponent(debouncedFullName)}`);
        const norm = (s) => (s || '').trim().toLowerCase();
        const found = (res?.data || []).filter((el) => norm(el.name).includes(norm(debouncedFullName)));
        setPaysageMatches(found);
      } catch { setPaysageMatches([]); }
    };
    checkPaysage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFullName]);

  useEffect(() => {
    const q = relationTypeQuery.toLowerCase().trim();
    const filtered = q
      ? allRelationTypes.filter((rt) => rt.name.toLowerCase().includes(q))
      : allRelationTypes;
    setRelationTypeOptions(filtered.slice(0, 30).map((rt) => ({ id: rt.id, name: rt.name })));
  }, [relationTypeQuery, allRelationTypes]);

  const handleNameChange = (field, value) => {
    if (field === 'firstName') setFirstName(value);
    if (field === 'lastName') setLastName(value);
    setExistingPersonId(undefined);
    setSelectedPydrefMatch(null);
    setSelectedWikidataMatch(null);
    setPaysageMatches([]);
  };

  const handleSelectPydrefMatch = async (match) => {
    setSelectedPydrefMatch(match);
    if (!match) {
      setIdentifiers((prev) => prev.filter((r) => !r.fromPydref && r.crossTrigger !== 'pydref'));
      return;
    }
    if (match.gender) setGender(PYDREF_GENDER[match.gender] || gender);
    if (match.birth_date) setBirthDate(match.birth_date.slice(0, 10));
    if (match.job) setActivity(match.job);
    setIdentifiers((prev) => {
      const manual = prev.filter((r) => !r.fromPydref && r.crossTrigger !== 'pydref');
      const usedTypes = new Set(manual.map((r) => r.type).filter(Boolean));
      const fromPydref = (match.identifiers || [])
        .flatMap((idObj) => Object.entries(idObj))
        .filter(([type]) => !usedTypes.has(type))
        .map(([type, value]) => ({ _key: uid(), type, value, fromPydref: true }));
      return [...fromPydref, ...manual];
    });
    const allIds = (match.identifiers || []).flatMap((idObj) => Object.entries(idObj));
    const orcid = allIds.find(([type]) => type === 'orcid')?.[1];
    const isni = allIds.find(([type]) => type === 'isni')?.[1];
    const idref = allIds.find(([type]) => type === 'idref')?.[1];
    let wdResult = null;
    if (orcid) wdResult = await crossEnrichWikidataPersonByOrcid(orcid).catch(() => null);
    else if (isni) wdResult = await crossEnrichWikidataPersonByIsni(isni).catch(() => null);
    else if (idref) wdResult = await crossEnrichWikidataPersonByIdRef(idref).catch(() => null);
    if (wdResult) {
      setIdentifiers((prev) => {
        const usedTypes = new Set(prev.filter((r) => r.type).map((r) => r.type));
        const extra = wdResult.identifiers
          .filter(({ type }) => !usedTypes.has(type))
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
      const withoutWikidata = prev.filter((r) => !r.fromWikidata);
      const usedTypes = new Set(withoutWikidata.filter((r) => r.type).map((r) => r.type));
      const fromWikidata = match.identifiers
        .filter(({ type }) => !usedTypes.has(type))
        .map(({ type, value }) => ({ _key: uid(), type, value, fromWikidata: true }));
      return [...withoutWikidata, ...fromWikidata];
    });
    setSocialMedias((prev) => {
      const withoutWikidata = prev.filter((r) => !r.fromWikidata);
      const usedTypes = new Set(withoutWikidata.filter((r) => r.type).map((r) => r.type));
      const fromWikidata = (match.socialMedias || [])
        .filter(({ type }) => !usedTypes.has(type))
        .map(({ type, account }) => ({ _key: uid(), type, account, fromWikidata: true }));
      return [...withoutWikidata, ...fromWikidata];
    });
  };

  const handleAddIdentifier = () => setIdentifiers((prev) => [...prev, { _key: uid(), type: '', value: '', fromPydref: false }]);
  const handleRemoveIdentifier = (key) => setIdentifiers((prev) => prev.filter((r) => r._key !== key));
  const handleChangeIdentifierType = (key, type) => setIdentifiers((prev) => prev.map((r) => (r._key === key ? { ...r, type } : r)));
  const handleChangeIdentifierValue = (key, value) => setIdentifiers((prev) => prev.map((r) => (r._key === key ? { ...r, value } : r)));

  const handleAddSocialMedia = () => setSocialMedias((prev) => [...prev, { _key: uid(), type: '', account: '' }]);
  const handleRemoveSocialMedia = (key) => setSocialMedias((prev) => prev.filter((r) => r._key !== key));
  const handleChangeSocialMediaType = (key, type) => setSocialMedias((prev) => prev.map((r) => (r._key === key ? { ...r, type } : r)));
  const handleChangeSocialMediaAccount = (key, account) => setSocialMedias((prev) => prev.map((r) => (r._key === key ? { ...r, account } : r)));

  const handleEnterIdentifiersStep = async () => {
    if (typeof existingPersonId === 'string' && identifiers.filter((r) => r.fromExisting).length === 0) {
      try {
        const { data: res } = await api.get(`/persons/${existingPersonId}/identifiers?limit=100`);
        const existing = (res?.data || []).map((id) => ({
          _key: uid(), type: id.type, value: id.value, originalValue: id.value, originalType: id.type, fromExisting: true,
        }));
        const existingTypes = new Set(existing.map((r) => r.type));
        setIdentifiers((prev) => [
          ...existing,
          ...prev.filter((r) => !r.fromExisting && !existingTypes.has(r.type)),
        ]);
      } catch { /* keep current */ }
    }
    setStep(2);
  };

  const handlePersonSearchQuery = async (q) => {
    setPersonSearchQuery(q);
    if (!q || q.length < 2) { setPersonSearchOptions([]); return; }
    setIsSearchingPerson(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=persons&query=${encodeURIComponent(q)}`);
      setPersonSearchOptions(res?.data || []);
    } catch { setPersonSearchOptions([]); }
    setIsSearchingPerson(false);
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
      const existing = (idData?.data || []).map((id) => ({
        _key: uid(), type: id.type, value: id.value, originalValue: id.value, originalType: id.type, fromExisting: true,
      }));
      setIdentifiers(existing);
    } catch {
      const parts = person.name.trim().split(' ');
      setFirstName(parts.slice(0, -1).join(' '));
      setLastName(parts[parts.length - 1] || person.name);
    }
  };

  const handleUnselectSearchPerson = () => {
    setSelectedSearchPerson(null);
    setExistingPersonId(undefined);
    setFirstName('');
    setLastName('');
    setGender('');
    setBirthDate('');
    setActivity('');
    setPersonSearchQuery('');
    setPersonSearchOptions([]);
    setIdentifiers([]);
    setSelectedPydrefMatch(null);
    setSelectedWikidataMatch(null);
  };

  const handleBackFromCreate = () => {
    setIsCreatingNew(false);
    setFirstName('');
    setLastName('');
    setGender('');
    setPersonErrors({});
    setShowPersonErrors(false);
    setExistingPersonId(undefined);
    setBirthDate('');
    setActivity('');
    setSelectedPydrefMatch(null);
    setSelectedWikidataMatch(null);
    setPaysageMatches([]);
  };

  const handleStructureQuery = async (q) => {
    setStructureQuery(q);
    if (!q || q.length < 2) { setStructureOptions([]); return; }
    setIsSearchingStructure(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=structures&query=${encodeURIComponent(q)}`);
      setStructureOptions(res?.data || []);
    } catch {
      setStructureOptions([]);
    }
    setIsSearchingStructure(false);
  };

  const handleSelectStructure = async (item) => {
    setSelectedStructure(item);
    setStructureQuery('');
    setStructureOptions([]);
    setActiveRelations([]);
    try {
      const { data: res } = await api.get(`/relations?filters[relationTag]=${GOUVERNANCE}&filters[resourceId]=${item.id}&limit=500`);
      const active = (res?.data || []).filter((m) => m.active !== false && (!m.endDate || m.endDate >= getComparableNow()));
      setActiveRelations(active);
    } catch {
      setActiveRelations([]);
    }
  };

  const handleUnselectStructure = () => {
    setSelectedStructure(null);
    setStructureOptions([]);
    setActiveRelations([]);
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
    handleEnterIdentifiersStep();
  };

  const handleNextFromIdentifiers = () => {
    const hasInvalid = identifiers.some((r) => {
      if (!r.type || !r.value) return false;
      const [regexp] = regexpValidateIdentifiers(r.type);
      return regexp && !regexp.test(sanitizeIdentifierValue(r.type, r.value));
    });
    if (hasInvalid) return;
    setStep(3);
  };

  const handleNextFromFonction = () => {
    if (!selectedRelationType) {
      setFonctionErrors({ relationTypeId: 'Veuillez choisir un type de mandat.' });
      setShowFonctionErrors(true);
      return;
    }
    setFonctionErrors({});
    setShowFonctionErrors(false);
    setStep(4);
  };

  const handleSubmit = async () => {
    if (!selectedStructure) return;

    let personId = existingPersonId || null;

    if (!personId) {
      try {
        const { data: personData } = await api.post('/persons', {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
          ...(birthDate ? { birthDate } : {}),
          ...(activity ? { activity } : {}),
        });
        personId = personData.id;
      } catch { notice(saveError); return; }
    }

    const newIdentifiers = identifiers.filter((r) => {
      if (!r.type || !r.value) return false;
      if (r.type === 'ark') return false;
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

    const toClose = relatedConflicts.filter((m) => m.id in conflictsToClose);
    if (toClose.length > 0) {
      await Promise.all(
        toClose.map((m) => api.patch(`/relations/${m.id}`, {
          resourceId: m.resourceId,
          relatedObjectId: m.relatedObjectId,
          endDate: conflictsToClose[m.id] || getComparableNow(),
        }).catch(() => null)),
      );
    }

    try {
      await api.post('/relations', {
        relatedObjectId: personId,
        resourceId: selectedStructure.id,
        relationTag: GOUVERNANCE,
        relationTypeId: selectedRelationType.id,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    } catch { notice(saveError); return; }

    notice(saveSuccess);
    handleReset(); // eslint-disable-line no-use-before-define
    navigate(`/personnes/${personId}`);
  };

  const handleReset = () => {
    setStep(1); setFirstName(''); setLastName(''); setGender('');
    setPersonErrors({}); setShowPersonErrors(false); setExistingPersonId(undefined);
    setSelectedPydrefMatch(null); setSelectedWikidataMatch(null);
    setPaysageMatches([]); setBirthDate(''); setActivity(''); setIdentifiers([]); setSocialMedias([]);
    setRelationTypeQuery(''); setRelationTypeOptions([]); setSelectedRelationType(null);
    setStartDate(''); setEndDate(''); setFonctionErrors({}); setShowFonctionErrors(false);
    setStructureQuery(''); setStructureOptions([]); setIsSearchingStructure(false);
    setSelectedStructure(null); setActiveRelations([]); setConflictsToClose({});
    setIsCreatingNew(false); setPersonSearchQuery(''); setPersonSearchOptions([]);
    setIsSearchingPerson(false); setSelectedSearchPerson(null);
    onClose();
  };

  const canProceedFromStructure = !!selectedStructure;
  const idrefDescriptions = selectedPydrefMatch?.description || [];

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
        selectedRelationType={selectedRelationType}
        startDate={startDate}
        selectedStructure={selectedStructure}
      />

      {step === 1 && (
        <>
          {!isCreatingNew ? (
            <>
              <PersonSearchStep
                query={personSearchQuery}
                setQuery={handlePersonSearchQuery}
                options={personSearchOptions}
                isSearching={isSearchingPerson}
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
            relationTypeQuery={relationTypeQuery}
            setRelationTypeQuery={setRelationTypeQuery}
            relationTypeOptions={relationTypeOptions}
            selectedRelationType={selectedRelationType}
            onSelectRelationType={(item) => { setSelectedRelationType(item); setRelationTypeQuery(''); }}
            onUnselectRelationType={() => { setSelectedRelationType(null); setRelationTypeQuery(''); }}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            errors={fonctionErrors}
            showErrors={showFonctionErrors}
            idrefDescriptions={idrefDescriptions}
          />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(2)}>
                Retour · Identifiants
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleNextFromFonction}>
                Suivant · Structure
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 4 && (
        <>
          <StructureRelationStep
            query={structureQuery}
            setQuery={handleStructureQuery}
            options={structureOptions}
            isSearching={isSearchingStructure}
            selectedStructure={selectedStructure}
            onSelect={handleSelectStructure}
            onUnselect={handleUnselectStructure}
            relatedConflicts={relatedConflicts}
            conflictsToClose={conflictsToClose}
            onToggleConflictToClose={(id) => setConflictsToClose((prev) => {
              const next = { ...prev };
              if (id in next) delete next[id]; else next[id] = '';
              return next;
            })}
            onSetClosureDate={(id, date) => setConflictsToClose((prev) => ({ ...prev, [id]: date }))}
            selectedRelationType={selectedRelationType}
            onGoBack={() => setStep(3)}
          />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(3)}>
                Retour · Fonction
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-save-line" iconPosition="left" onClick={handleSubmit} disabled={!canProceedFromStructure}>
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
