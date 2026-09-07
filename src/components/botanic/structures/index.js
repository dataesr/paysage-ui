import { useEffect, useMemo, useState } from 'react';
import { Col, Row, Stepper } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../../button';
import useFetch from '../../../hooks/useFetch';
import useEnums from '../../../hooks/useEnums';
import useNotice from '../../../hooks/useNotice';
import useSubmitGuard from '../../../hooks/useSubmitGuard';
import api from '../../../utils/api';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import { getComparableNow } from '../../../utils/dates';
import { uid, sanitizeIdentifierValue, relationTypesUrl, MANDATE_RELATED_OBJECT_TYPES } from '../utils';
import { regexpValidateIdentifiers } from '../../../utils/regexpForIdentifiers';
import useDebounce from '../../../hooks/useDebounce';
import { useStructureExternalLookup } from '../use-external-lookup';
import { crossEnrichWikidataStructure, crossEnrichRorById } from '../external-lookup';
import EnrichmentPanel from '../enrichment-panel';
import StructureSearchStep from './components/search-step';
import StructureIdentifiersStep from './components/identifiers-step';
import StructureMandateStep from './components/mandate-step';
import LocalisationStep from './components/localisation-step';
import StructureSummaryBar from './components/summary-bar';

const STEPS = ['Structure', 'Identifiants', 'Localisation', 'Mandat de gouvernance'];

export default function StructureFlow({ onClose, onCreated }) {
  const { notice } = useNotice();
  const enums = useEnums();
  const { data: relationTypesData } = useFetch(relationTypesUrl(MANDATE_RELATED_OBJECT_TYPES));
  const allRelationTypes = useMemo(() => relationTypesData?.data || [], [relationTypesData]);
  const identifierOptions = enums?.identifiers?.structures || [{ label: 'Sélectionner un type', value: '' }];
  const socialMediaOptions = enums?.socialMedias || [{ label: 'Sélectionner un type', value: '' }];
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [structureQuery, setStructureQuery] = useState('');
  const [structureOptions, setStructureOptions] = useState([]);
  const [isSearchingStructure, setIsSearchingStructure] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [usualName, setUsualName] = useState('');
  const [step1Errors, setStep1Errors] = useState({});
  const [paysageNameMatches, setPaysageNameMatches] = useState([]);

  const debouncedUsualName = useDebounce(usualName.trim(), 700);
  useEffect(() => {
    if (!isCreatingNew || debouncedUsualName.length < 3) { setPaysageNameMatches([]); return; }
    let cancelled = false;
    api.get(`/autocomplete?types=structures&query=${encodeURIComponent(debouncedUsualName)}`)
      .then(({ data: res }) => { if (!cancelled) setPaysageNameMatches(res?.data?.slice(0, 5) || []); })
      .catch(() => { if (!cancelled) setPaysageNameMatches([]); });
    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; };
  }, [isCreatingNew, debouncedUsualName]);

  const [identifiers, setIdentifiers] = useState([]);
  const [socialMedias, setSocialMedias] = useState([]);

  const structureLookupName = isCreatingNew ? usualName : (selectedStructure?.name || '');
  const {
    wikidataLoading, wikidataMatches, rorLoading, rorMatches,
  } = useStructureExternalLookup(structureLookupName);
  const [selectedWikidataMatch, setSelectedWikidataMatch] = useState(null);
  const [selectedRorMatch, setSelectedRorMatch] = useState(null);

  const [localisationBody, setLocalisationBody] = useState(null);

  const [mandates, setMandates] = useState([]);

  const existingIdentifierTypes = useMemo(
    () => new Set(identifiers.filter((r) => r.fromExisting).map((r) => r.type)),
    [identifiers],
  );
  const isEditMode = !!selectedStructure;
  const panelWikidataMatches = (isEditMode && existingIdentifierTypes.has('wikidata')) ? [] : wikidataMatches;
  const panelWikidataLoading = (isEditMode && existingIdentifierTypes.has('wikidata')) ? false : wikidataLoading;
  const panelRorMatches = (isEditMode && existingIdentifierTypes.has('ror')) ? [] : rorMatches;
  const panelRorLoading = (isEditMode && existingIdentifierTypes.has('ror')) ? false : rorLoading;

  const locationHint = useMemo(() => {
    const match = selectedRorMatch || selectedWikidataMatch;
    if (!match) return null;
    const coords = match.coordinates || null;
    if (selectedRorMatch) {
      return {
        coordinates: coords,
        city: match.city || null,
        country: match.country || null,
        countryCode: match.countryCode || null,
        searchQuery: !coords ? ([match.city, match.country].filter(Boolean).join(', ') || null) : null,
      };
    }
    return {
      coordinates: coords,
      streetAddress: match.streetAddress || null,
      searchQuery: !coords ? (match.streetAddress || null) : null,
    };
  }, [selectedRorMatch, selectedWikidataMatch]);

  const [externalDuplicates, setExternalDuplicates] = useState({});

  useEffect(() => {
    if (!wikidataMatches.length && !rorMatches.length) { setExternalDuplicates({}); return; }
    let cancelled = false;
    const checkAll = async () => {
      const entries = [];
      await Promise.all([
        ...wikidataMatches.map(async (m) => {
          try {
            const { data: res } = await api.get(`/autocomplete?types=structures&query=${encodeURIComponent(m.qid)}`);
            const found = (res?.data || []).find((el) => el?.identifiers?.includes(m.qid));
            if (found) entries.push([m.qid, { id: found.id, name: found.name }]);
          } catch { /* ignore */ }
        }),
        ...rorMatches.map(async (m) => {
          try {
            const { data: res } = await api.get(`/autocomplete?types=structures&query=${encodeURIComponent(m.rorId)}`);
            const found = (res?.data || []).find((el) => el?.identifiers?.includes(m.rorId));
            if (found) entries.push([m.rorId, { id: found.id, name: found.name }]);
          } catch { /* ignore */ }
        }),
      ]);
      if (!cancelled) setExternalDuplicates(Object.fromEntries(entries));
    };
    checkAll();
    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; };
  }, [wikidataMatches, rorMatches]);

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
    try {
      const { data: res } = await api.get(`/structures/${item.id}/identifiers?limit=100`);
      const existing = (res?.data || []).map((id) => ({
        _key: uid(), type: id.type, value: id.value, originalValue: id.value, originalType: id.type, fromExisting: true,
      }));
      setIdentifiers(existing);
    } catch {
      setIdentifiers([]);
    }
  };

  const handleUnselectStructure = () => {
    setSelectedStructure(null);
    setStructureOptions([]);
    setIdentifiers([]);
    setSocialMedias((prev) => prev.filter((r) => !r.fromWikidata && !r.fromRor));
    setSelectedWikidataMatch(null);
    setSelectedRorMatch(null);
  };

  const handleToggleCreateNew = () => {
    setIsCreatingNew((prev) => !prev);
    setStructureQuery('');
    setStructureOptions([]);
    setSelectedStructure(null);
    setIdentifiers([]);
    setSocialMedias((prev) => prev.filter((r) => !r.fromWikidata && !r.fromRor));
    setSelectedWikidataMatch(null);
    setSelectedRorMatch(null);
    setPaysageNameMatches([]);
  };

  const handleAddMandate = (mandate) => setMandates((prev) => [...prev, { _key: uid(), ...mandate }]);
  const handleRemoveMandate = (key) => setMandates((prev) => prev.filter((m) => m._key !== key));

  const handleAddIdentifier = () => setIdentifiers((prev) => [...prev, { _key: uid(), type: '', value: '', fromExisting: false }]);
  const handleRemoveIdentifier = (key) => setIdentifiers((prev) => prev.filter((r) => r._key !== key));
  const handleChangeIdentifierType = (key, type) => setIdentifiers((prev) => prev.map((r) => (r._key === key ? { ...r, type } : r)));
  const handleChangeIdentifierValue = (key, value) => setIdentifiers((prev) => prev.map((r) => (r._key === key ? { ...r, value } : r)));

  const handleAddSocialMedia = () => setSocialMedias((prev) => [...prev, { _key: uid(), type: '', account: '' }]);
  const handleRemoveSocialMedia = (key) => setSocialMedias((prev) => prev.filter((r) => r._key !== key));
  const handleChangeSocialMediaType = (key, type) => setSocialMedias((prev) => prev.map((r) => (r._key === key ? { ...r, type } : r)));
  const handleChangeSocialMediaAccount = (key, account) => setSocialMedias((prev) => prev.map((r) => (r._key === key ? { ...r, account } : r)));

  const handleSelectWikidataMatch = async (match) => {
    setSelectedWikidataMatch(match);
    if (!match) {
      setIdentifiers((prev) => prev.filter((r) => !r.fromWikidata && r.crossTrigger !== 'wikidata'));
      setSocialMedias((prev) => prev.filter((r) => !r.fromWikidata && r.crossTrigger !== 'wikidata'));
      return;
    }
    setIdentifiers((prev) => {
      const withoutWikidata = prev.filter((r) => !r.fromWikidata && r.crossTrigger !== 'wikidata');
      const usedNewTypes = new Set(withoutWikidata.filter((r) => r.type && !r.fromExisting).map((r) => r.type));
      const fromWikidata = match.identifiers
        .filter(({ type }) => !usedNewTypes.has(type))
        .map(({ type, value }) => ({ _key: uid(), type, value, fromWikidata: true }));
      return [...withoutWikidata, ...fromWikidata];
    });
    setSocialMedias((prev) => {
      const withoutWikidata = prev.filter((r) => !r.fromWikidata && r.crossTrigger !== 'wikidata');
      const usedTypes = new Set(withoutWikidata.filter((r) => r.type).map((r) => r.type));
      const fromWikidata = (match.socialMedias || [])
        .filter(({ type }) => !usedTypes.has(type))
        .map(({ type, account }) => ({ _key: uid(), type, account, fromWikidata: true }));
      return [...withoutWikidata, ...fromWikidata];
    });
    const rorId = match.identifiers.find((id) => id.type === 'ror')?.value;
    if (rorId) {
      const rorResult = await crossEnrichRorById(rorId).catch(() => null);
      if (rorResult) {
        setIdentifiers((prev) => {
          const usedNewTypes = new Set(prev.filter((r) => r.type && !r.fromExisting).map((r) => r.type));
          const extra = rorResult.identifiers
            .filter(({ type }) => !usedNewTypes.has(type))
            .map(({ type, value }) => ({ _key: uid(), type, value, fromRor: true, via: 'Wikidata', crossTrigger: 'wikidata' }));
          return [...prev, ...extra];
        });
      }
    }
  };

  const handleNextFromSearch = () => {
    if (!selectedStructure && !isCreatingNew) {
      setStep1Errors({ structure: 'Sélectionnez une structure existante ou créez-en une nouvelle.' });
      return;
    }
    if (isCreatingNew && !usualName.trim()) {
      setStep1Errors({ usualName: 'Le nom usuel est obligatoire.' });
      return;
    }
    setStep1Errors({});
    setStep(2);
  };

  const handleNextFromIdentifiers = () => {
    const invalidEntry = identifiers.find((r) => {
      if (!r.type || !r.value) return false;
      if (r.fromExisting && r.value === r.originalValue && r.type === r.originalType) return false;
      if (r.fromWikidata) return false;
      const [regexp] = regexpValidateIdentifiers(r.type);
      return regexp && !regexp.test(sanitizeIdentifierValue(r.type, r.value));
    });
    if (invalidEntry) return;
    setStep(3);
  };

  const handleSubmit = async () => {
    let structureId = selectedStructure?.id || null;

    if (!structureId) {
      try {
        const { data: structureData } = await api.post('/structures', { usualName: usualName.trim() });
        structureId = structureData.id;
      } catch { notice(saveError); return; }
    }

    const newIdentifiers = identifiers.filter((r) => {
      if (!r.type || !r.value) return false;
      if (r.fromExisting && r.value === r.originalValue && r.type === r.originalType) return false;
      const [regexp] = regexpValidateIdentifiers(r.type);
      return !regexp || regexp.test(sanitizeIdentifierValue(r.type, r.value));
    });

    if (newIdentifiers.length > 0) {
      await Promise.all(newIdentifiers.map((r) => api.post(`/structures/${structureId}/identifiers`, {
        type: r.type, value: sanitizeIdentifierValue(r.type, r.value), active: true,
      }).catch(() => null)));
    }

    const newSocialMedias = socialMedias.filter((r) => r.type && r.account);
    if (newSocialMedias.length > 0) {
      await Promise.all(newSocialMedias.map((r) => {
        const account = r.account.startsWith('https://') ? r.account : `https://${r.account}`;
        return api.post(`/structures/${structureId}/social-medias`, { type: r.type, account }).catch(() => null);
      }));
    }

    if (localisationBody && (localisationBody.country || localisationBody.address)) {
      await api.post(`/structures/${structureId}/localisations`, localisationBody).catch(() => null);
    }

    if (mandates.length > 0) {
      const results = await Promise.all(mandates.map((m) => api.post('/relations', {
        resourceId: structureId,
        relatedObjectId: m.person.id,
        relationTag: GOUVERNANCE,
        relationTypeId: m.relationType.id,
        startDate: m.startDate || undefined,
        endDate: m.endDate || undefined,
        endDatePrevisional: m.endDatePrevisional || undefined,
        active: m.active,
        mandateReason: m.reason || undefined,
        mandateTemporary: m.temporary,
        mandatePosition: m.position || undefined,
        mandatePrecision: m.precision || undefined,
        mandateEmail: m.email || undefined,
        personalEmail: m.personalEmail || undefined,
        mandatePhonenumber: m.phonenumber || undefined,
        startDateOfficialTextId: m.startDateOfficialTextId || undefined,
        endDateOfficialTextId: m.endDateOfficialTextId || undefined,
      }).catch(() => null)));
      if (results.some((r) => r === null)) { notice(saveError); return; }
    }

    const closures = [];
    mandates.forEach((m) => { (m.closures || []).forEach((c) => closures.push(c)); });
    if (closures.length > 0) {
      await Promise.all(closures.map((c) => api.patch(`/relations/${c.id}`, {
        resourceId: c.resourceId,
        relatedObjectId: c.relatedObjectId,
        endDate: c.endDate || getComparableNow(),
      }).catch(() => null)));
    }

    notice(saveSuccess);
    const createdName = selectedStructure?.name || usualName.trim();
    if (onCreated) {
      onCreated({ id: structureId, name: createdName });
      handleReset(); // eslint-disable-line no-use-before-define
    } else {
      handleReset(); // eslint-disable-line no-use-before-define
      navigate(`/structures/${structureId}`);
    }
  };
  const guardedSubmit = useSubmitGuard(handleSubmit);

  const handleAdoptStructureName = (name) => {
    if (name && isCreatingNew) setUsualName(name);
  };

  const handleSelectRorMatch = async (match) => {
    setSelectedRorMatch(match);
    if (!match) {
      setIdentifiers((prev) => prev.filter((r) => !r.fromRor && r.crossTrigger !== 'ror'));
      return;
    }
    setIdentifiers((prev) => {
      const withoutRor = prev.filter((r) => !r.fromRor && r.crossTrigger !== 'ror');
      const usedNewTypes = new Set(withoutRor.filter((r) => r.type && !r.fromExisting).map((r) => r.type));
      const fromRor = match.identifiers
        .filter(({ type }) => !usedNewTypes.has(type))
        .map(({ type, value }) => ({ _key: uid(), type, value, fromRor: true }));
      return [...withoutRor, ...fromRor];
    });
    // Cross-enrich: ROR → Wikidata
    const wikidataId = match.identifiers.find((id) => id.type === 'wikidata')?.value;
    if (wikidataId) {
      const wdResult = await crossEnrichWikidataStructure(wikidataId).catch(() => null);
      if (wdResult) {
        setIdentifiers((prev) => {
          const usedNewTypes = new Set(prev.filter((r) => r.type && !r.fromExisting).map((r) => r.type));
          const extra = wdResult.identifiers
            .filter(({ type }) => !usedNewTypes.has(type))
            .map(({ type, value }) => ({ _key: uid(), type, value, fromWikidata: true, via: 'ROR', crossTrigger: 'ror' }));
          return [...prev, ...extra];
        });
      }
    }
  };

  const handleReset = () => {
    setStep(1); setStructureQuery(''); setStructureOptions([]); setIsSearchingStructure(false);
    setSelectedStructure(null); setIsCreatingNew(false); setUsualName(''); setStep1Errors({}); setPaysageNameMatches([]);
    setIdentifiers([]); setMandates([]); setSocialMedias([]); setSelectedWikidataMatch(null); setSelectedRorMatch(null); setLocalisationBody(null);
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

      <StructureSummaryBar
        step={step}
        selectedStructure={selectedStructure}
        usualName={usualName}
        mandateCount={mandates.length}
      />

      {step === 1 && (
        <>
          <StructureSearchStep
            query={structureQuery}
            setQuery={handleStructureQuery}
            options={structureOptions}
            isSearching={isSearchingStructure}
            selectedStructure={selectedStructure}
            onSelect={handleSelectStructure}
            onUnselect={handleUnselectStructure}
            isCreatingNew={isCreatingNew}
            usualName={usualName}
            onUsualNameChange={setUsualName}
            onToggleCreateNew={handleToggleCreateNew}
            paysageMatches={paysageNameMatches}
            onSelectExisting={(item) => { setIsCreatingNew(false); handleSelectStructure(item); }}
          />
          <EnrichmentPanel
            wikidataLoading={panelWikidataLoading}
            wikidataMatches={panelWikidataMatches}
            selectedWikidataMatch={selectedWikidataMatch}
            onSelectWikidata={handleSelectWikidataMatch}
            rorLoading={panelRorLoading}
            rorMatches={panelRorMatches}
            selectedRorMatch={selectedRorMatch}
            onSelectRor={handleSelectRorMatch}
            entityType="structure"
            onAdoptName={isCreatingNew ? handleAdoptStructureName : null}
            externalDuplicates={externalDuplicates}
          />
          {step1Errors.structure && <p className="fr-error-text fr-mt-1w">{step1Errors.structure}</p>}
          {step1Errors.usualName && <p className="fr-error-text fr-mt-1w">{step1Errors.usualName}</p>}
          <Row justifyContent="right" spacing="mt-3w">
            <Col n="auto">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleNextFromSearch}>
                Suivant · Identifiants
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 2 && (
        <>
          <StructureIdentifiersStep
            identifiers={identifiers}
            identifierOptions={identifierOptions}
            onAdd={handleAddIdentifier}
            onRemove={handleRemoveIdentifier}
            onChangeType={handleChangeIdentifierType}
            onChangeValue={handleChangeIdentifierValue}
            isExisting={!!selectedStructure}
            existingStructureName={selectedStructure?.name || null}
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
                Retour · Structure
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleNextFromIdentifiers}>
                Suivant · Localisation
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 3 && (
        <>
          <LocalisationStep onBodyChange={setLocalisationBody} locationHint={locationHint} />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(2)}>
                Retour · Identifiants
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={() => setStep(4)}>
                Suivant · Mandat
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 4 && (
        <>
          <div className="fr-mb-3w fr-p-2w" style={{ background: 'var(--grey-975-75)', borderLeft: '3px solid var(--blue-france-sun-113-625)' }}>
            <p className="fr-text--sm fr-text--bold fr-mb-1w">Ce qui sera enregistré</p>
            <p className="fr-text--sm fr-mb-1v">
              <strong>Structure :</strong>
              {' '}
              {selectedStructure ? (
                <a href={`/structures/${selectedStructure.id}`} target="_blank" rel="noreferrer">
                  {selectedStructure.name}
                  {' '}
                  ↗
                </a>
              ) : usualName}
              {selectedStructure ? (
                <span className="fr-badge fr-badge--sm fr-badge--success fr-ml-1w">Existante</span>
              ) : (
                <span className="fr-badge fr-badge--sm fr-badge--new fr-ml-1w">Nouvelle</span>
              )}
            </p>
            {identifiers.filter((r) => r.type && r.value && !r.fromExisting).length > 0 && (
              <p className="fr-text--xs fr-hint-text fr-mb-1v">
                <strong>Identifiants :</strong>
                {' '}
                {identifiers.filter((r) => r.type && r.value && !r.fromExisting).map((r) => `${r.type} · ${r.value}`).join(', ')}
              </p>
            )}
            {mandates.length > 0 && (
              <div className="fr-mt-1v">
                <p className="fr-text--xs fr-hint-text fr-mb-1v">
                  <strong>{`${mandates.length} mandat${mandates.length > 1 ? 's' : ''} ajouté${mandates.length > 1 ? 's' : ''} :`}</strong>
                </p>
                {mandates.map((m) => (
                  <p key={m._key} className="fr-text--xs fr-mb-0">
                    {`${m.person.name} — ${m.relationType.name}`}
                    {m.startDate ? ` · à partir du ${m.startDate}` : ''}
                    {m.endDate ? ` · jusqu'au ${m.endDate}` : ''}
                    {m.temporary ? ' · par intérim' : ''}
                  </p>
                ))}
              </div>
            )}
          </div>
          <StructureMandateStep
            mandates={mandates}
            onAddMandate={handleAddMandate}
            onRemoveMandate={handleRemoveMandate}
            allRelationTypes={allRelationTypes}
            structureId={selectedStructure?.id || null}
          />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(3)}>
                Retour · Localisation
              </Button>
            </Col>
            <Col className="text-right">
              <Button icon="ri-save-line" iconPosition="left" onClick={guardedSubmit}>
                {selectedStructure ? 'Mettre à jour la structure' : 'Créer la structure'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

StructureFlow.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
};
StructureFlow.defaultProps = {
  onCreated: null,
};
