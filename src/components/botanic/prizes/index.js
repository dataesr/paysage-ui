import { useEffect, useMemo, useState } from 'react';
import { Col, Row, Stepper } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../button';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import { LAUREAT } from '../../../utils/relations-tags';
import PrizeSearchStep from './components/search-step';
import LaureatStep from './components/laureate-step';
import PrizeSummaryBar from './components/summary-bar';

const STEPS = ['Prix', 'Lauréat'];

export default function PrizeFlow({ onClose }) {
  const { notice } = useNotice();
  const { data: relationTypesData } = useFetch('/relation-types?limit=500&filters[for]=prizes');
  const allRelationTypes = useMemo(() => relationTypesData?.data || [], [relationTypesData]);

  const [step, setStep] = useState(1);

  // Step 1 – Prize search/create
  const [prizeQuery, setPrizeQuery] = useState('');
  const [prizeOptions, setPrizeOptions] = useState([]);
  const [isSearchingPrize, setIsSearchingPrize] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [prizeStartDate, setPrizeStartDate] = useState('');
  const [prizeEndDate, setPrizeEndDate] = useState('');
  const [step1Errors, setStep1Errors] = useState({});

  // Step 2 – Laureate
  const [laureateQuery, setLaureateQuery] = useState('');
  const [laureateOptions, setLaureateOptions] = useState([]);
  const [isSearchingLaureate, setIsSearchingLaureate] = useState(false);
  const [selectedLaureate, setSelectedLaureate] = useState(null);
  const [relationTypeQuery, setRelationTypeQuery] = useState('');
  const [relationTypeOptions, setRelationTypeOptions] = useState([]);
  const [selectedRelationType, setSelectedRelationType] = useState(null);
  const [laureateStartDate, setLaureateStartDate] = useState('');
  const [laureateEndDate, setLaureateEndDate] = useState('');
  const [laureateErrors, setLaureateErrors] = useState({});
  const [showLaureateErrors, setShowLaureateErrors] = useState(false);

  useEffect(() => {
    const q = relationTypeQuery.toLowerCase().trim();
    const filtered = q
      ? allRelationTypes.filter((rt) => rt.name.toLowerCase().includes(q))
      : allRelationTypes;
    setRelationTypeOptions(filtered.slice(0, 30).map((rt) => ({ id: rt.id, name: rt.name })));
  }, [relationTypeQuery, allRelationTypes]);

  const handlePrizeQuery = async (q) => {
    setPrizeQuery(q);
    if (!q || q.length < 2) { setPrizeOptions([]); return; }
    setIsSearchingPrize(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=prizes&query=${encodeURIComponent(q)}`);
      setPrizeOptions(res?.data || []);
    } catch {
      setPrizeOptions([]);
    }
    setIsSearchingPrize(false);
  };

  const handleSelectPrize = (item) => {
    setSelectedPrize(item);
    setPrizeQuery('');
    setPrizeOptions([]);
  };

  const handleUnselectPrize = () => {
    setSelectedPrize(null);
    setPrizeOptions([]);
  };

  const handleToggleCreateNew = () => {
    setIsCreatingNew((prev) => !prev);
    setPrizeQuery('');
    setPrizeOptions([]);
    setSelectedPrize(null);
  };

  const handleLaureateQuery = async (q) => {
    setLaureateQuery(q);
    if (!q || q.length < 2) { setLaureateOptions([]); return; }
    setIsSearchingLaureate(true);
    try {
      const { data: res } = await api.get(`/autocomplete?types=persons,structures&query=${encodeURIComponent(q)}`);
      setLaureateOptions(res?.data || []);
    } catch {
      setLaureateOptions([]);
    }
    setIsSearchingLaureate(false);
  };

  const handleNextFromSearch = () => {
    if (!selectedPrize && !isCreatingNew) {
      setStep1Errors({ prize: 'Sélectionnez un prix existant ou créez-en un nouveau.' });
      return;
    }
    if (isCreatingNew && !nameFr.trim()) {
      setStep1Errors({ nameFr: 'Le nom en français est obligatoire.' });
      return;
    }
    setStep1Errors({});
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedLaureate) {
      setLaureateErrors({ laureateId: 'Veuillez sélectionner un lauréat.' });
      setShowLaureateErrors(true);
      return;
    }
    if (!selectedRelationType) {
      setLaureateErrors({ relationTypeId: 'Veuillez choisir un type de relation.' });
      setShowLaureateErrors(true);
      return;
    }
    setLaureateErrors({});
    setShowLaureateErrors(false);

    let prizeId = selectedPrize?.id || null;

    if (!prizeId) {
      try {
        const { data: prizeData } = await api.post('/prizes', {
          nameFr: nameFr.trim(),
          ...(nameEn.trim() ? { nameEn: nameEn.trim() } : {}),
          ...(prizeStartDate ? { startDate: prizeStartDate } : {}),
          ...(prizeEndDate ? { endDate: prizeEndDate } : {}),
        });
        prizeId = prizeData.id;
      } catch { notice(saveError); return; }
    }

    try {
      await api.post('/relations', {
        resourceId: prizeId,
        relatedObjectId: selectedLaureate.id,
        relationTag: LAUREAT,
        relationTypeId: selectedRelationType.id,
        startDate: laureateStartDate || undefined,
        endDate: laureateEndDate || undefined,
      });
    } catch { notice(saveError); return; }

    notice(saveSuccess);
    handleReset(); // eslint-disable-line no-use-before-define
  };

  const handleReset = () => {
    setStep(1); setPrizeQuery(''); setPrizeOptions([]); setIsSearchingPrize(false);
    setSelectedPrize(null); setIsCreatingNew(false); setNameFr(''); setNameEn('');
    setPrizeStartDate(''); setPrizeEndDate(''); setStep1Errors({});
    setLaureateQuery(''); setLaureateOptions([]); setIsSearchingLaureate(false);
    setSelectedLaureate(null); setRelationTypeQuery(''); setRelationTypeOptions([]);
    setSelectedRelationType(null); setLaureateStartDate(''); setLaureateEndDate('');
    setLaureateErrors({}); setShowLaureateErrors(false);
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

      <PrizeSummaryBar
        step={step}
        selectedPrize={selectedPrize}
        nameFr={nameFr}
        selectedLaureate={selectedLaureate}
        selectedRelationType={selectedRelationType}
      />

      {step === 1 && (
        <>
          <PrizeSearchStep
            query={prizeQuery}
            setQuery={handlePrizeQuery}
            options={prizeOptions}
            isSearching={isSearchingPrize}
            selectedPrize={selectedPrize}
            onSelect={handleSelectPrize}
            onUnselect={handleUnselectPrize}
            isCreatingNew={isCreatingNew}
            nameFr={nameFr}
            onNameFrChange={setNameFr}
            nameEn={nameEn}
            onNameEnChange={setNameEn}
            startDate={prizeStartDate}
            onStartDateChange={setPrizeStartDate}
            endDate={prizeEndDate}
            onEndDateChange={setPrizeEndDate}
            onToggleCreateNew={handleToggleCreateNew}
            errors={step1Errors}
          />
          {step1Errors.prize && <p className="fr-error-text fr-mt-1w">{step1Errors.prize}</p>}
          <Row justifyContent="right" spacing="mt-3w">
            <Col n="auto">
              <Button icon="ri-arrow-right-line" iconPosition="right" onClick={handleNextFromSearch}>
                Suivant · Lauréat
              </Button>
            </Col>
          </Row>
        </>
      )}

      {step === 2 && (
        <>
          <LaureatStep
            laureateQuery={laureateQuery}
            setLaureateQuery={handleLaureateQuery}
            laureateOptions={laureateOptions}
            isSearchingLaureate={isSearchingLaureate}
            selectedLaureate={selectedLaureate}
            onSelectLaureate={(item) => { setSelectedLaureate(item); setLaureateQuery(''); setLaureateOptions([]); }}
            onUnselectLaureate={() => { setSelectedLaureate(null); setLaureateQuery(''); }}
            relationTypeQuery={relationTypeQuery}
            setRelationTypeQuery={setRelationTypeQuery}
            relationTypeOptions={relationTypeOptions}
            selectedRelationType={selectedRelationType}
            onSelectRelationType={(item) => { setSelectedRelationType(item); setRelationTypeQuery(''); }}
            onUnselectRelationType={() => { setSelectedRelationType(null); setRelationTypeQuery(''); }}
            startDate={laureateStartDate}
            onStartDateChange={setLaureateStartDate}
            endDate={laureateEndDate}
            onEndDateChange={setLaureateEndDate}
            errors={laureateErrors}
            showErrors={showLaureateErrors}
          />
          <Row justifyContent="right" spacing="mt-3w" gutters>
            <Col>
              <Button secondary icon="ri-arrow-left-line" iconPosition="left" onClick={() => setStep(1)}>
                Retour · Prix
              </Button>
            </Col>
            <Col>
              <Button icon="ri-save-line" iconPosition="left" onClick={handleSubmit}>
                {selectedPrize ? 'Ajouter le lauréat' : 'Créer le prix et ajouter le lauréat'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

PrizeFlow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
