import { useCallback, useMemo, useState } from 'react';
import { Col, Row, Stepper } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../../button';
import useFetch from '../../../hooks/useFetch';
import useEnums from '../../../hooks/useEnums';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import { getComparableNow } from '../../../utils/dates';
import { uid, sanitizeIdentifierValue } from '../utils';
import { regexpValidateIdentifiers } from '../../../utils/regexpForIdentifiers';
import { useStructureExternalLookup } from '../use-external-lookup';
import { crossEnrichWikidataStructure, crossEnrichRorById } from '../external-lookup';
import EnrichmentPanel from '../enrichment-panel';
import StructureSearchStep from './components/search-step';
import StructureIdentifiersStep from './components/identifiers-step';
import StructureMandateStep from './components/mandate-step';
import LocalisationStep from './components/localisation-step';
import StructureSummaryBar from './components/summary-bar';

const STEPS = ['Structure', 'Identifiants', 'Localisation', 'Mandat de gouvernance'];

export default function StructureFlow({ onClose }) {
  const { notice } = useNotice();
  const enums = useEnums();
  const { data: relationTypesData } = useFetch('/relation-types?limit=500&filters[for]=persons');
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
  };

  const handleLocalisationBodyChange = useCallback((body) => setLocalisationBody(body), []);

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
      const usedTypes = new Set(withoutWikidata.filter((r) => r.type).map((r) => r.type));
      const fromWikidata = match.identifiers
        .filter(({ type }) => !usedTypes.has(type))
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
          const usedTypes = new Set(prev.filter((r) => r.type).map((r) => r.type));
          const extra = rorResult.identifiers
            .filter(({ type }) => !usedTypes.has(type))
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
      }).catch(() => null)));
      if (results.some((r) => r === null)) { notice(saveError); return; }
    }

    const closures = mandates.flatMap((m) => m.closures || []);
    if (closures.length > 0) {
      await Promise.all(closures.map((c) => api.patch(`/relations/${c.id}`, {
        resourceId: c.resourceId,
        relatedObjectId: c.relatedObjectId,
        endDate: c.endDate || getComparableNow(),
      }).catch(() => null)));
    }

    notice(saveSuccess);
    handleReset(); // eslint-disable-line no-use-before-define
    navigate(`/structures/${structureId}`);
  };

  const handleSelectRorMatch = async (match) => {
    setSelectedRorMatch(match);
    if (!match) {
      setIdentifiers((prev) => prev.filter((r) => !r.fromRor && r.crossTrigger !== 'ror'));
      return;
    }
    setIdentifiers((prev) => {
      const withoutRor = prev.filter((r) => !r.fromRor && r.crossTrigger !== 'ror');
      const usedTypes = new Set(withoutRor.filter((r) => r.type).map((r) => r.type));
      const fromRor = match.identifiers
        .filter(({ type }) => !usedTypes.has(type))
        .map(({ type, value }) => ({ _key: uid(), type, value, fromRor: true }));
      return [...withoutRor, ...fromRor];
    });
    // Cross-enrich: ROR → Wikidata
    const wikidataId = match.identifiers.find((id) => id.type === 'wikidata')?.value;
    if (wikidataId) {
      const wdResult = await crossEnrichWikidataStructure(wikidataId).catch(() => null);
      if (wdResult) {
        setIdentifiers((prev) => {
          const usedTypes = new Set(prev.filter((r) => r.type).map((r) => r.type));
          const extra = wdResult.identifiers
            .filter(({ type }) => !usedTypes.has(type))
            .map(({ type, value }) => ({ _key: uid(), type, value, fromWikidata: true, via: 'ROR', crossTrigger: 'ror' }));
          return [...prev, ...extra];
        });
      }
    }
  };

  const handleReset = () => {
    setStep(1); setStructureQuery(''); setStructureOptions([]); setIsSearchingStructure(false);
    setSelectedStructure(null); setIsCreatingNew(false); setUsualName(''); setStep1Errors({});
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
          />
          <EnrichmentPanel
            wikidataLoading={wikidataLoading}
            wikidataMatches={wikidataMatches}
            selectedWikidataMatch={selectedWikidataMatch}
            onSelectWikidata={handleSelectWikidataMatch}
            rorLoading={rorLoading}
            rorMatches={rorMatches}
            selectedRorMatch={selectedRorMatch}
            onSelectRor={handleSelectRorMatch}
            entityType="structure"
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
          <LocalisationStep onBodyChange={handleLocalisationBodyChange} />
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
              <Button icon="ri-save-line" iconPosition="left" onClick={handleSubmit}>
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
};
