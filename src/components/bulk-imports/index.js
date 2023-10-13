import { Col, Container, Row, Stepper, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { PageSpinner } from '../spinner';
import AnalyseStep from './components/analyse-step';
import FormStep from './components/form-step';
import ReportStep from './components/report-step';
import analyse from './lib/analysers';
import bulkImport from './lib/importers';

const steps = ['Ajouter des données', 'Analyse des données', "Rapport d'analyse", 'Import des données', "Rapport d'importation"];

export default function BulkImport({ type }) {
  const [input, setInput] = useState();
  const [state, setState] = useState();
  const [isAnalysing, setIsAnalysing] = useState();
  const [isAnalysed, setIsAnalysed] = useState();
  const [fileError, setFileError] = useState();
  const [isImporting, setIsImporting] = useState();
  const [isImported, setIsImported] = useState();

  const step = useMemo(() => {
    if (fileError) return 1;
    if (isAnalysing) return 2;
    if (isAnalysed && isImporting) return 4;
    if (isAnalysed && isImported) return 5;
    if (isAnalysed) return 3;
    return 1;
  }, [isImported, isAnalysing, isAnalysed, isImporting, fileError]);

  const onReset = () => {
    setInput(undefined);
    setState(undefined);
    setIsAnalysing(undefined);
    setIsAnalysed(undefined);
    setFileError(undefined);
    setIsImporting(undefined);
    setIsImported(undefined);
  };

  const onInputValidation = async (userInput) => {
    setInput(userInput);
    setIsAnalysing(true);
    analyse(userInput, type)
      .then((analysed) => {
        setState(analysed);
      })
      .catch(() => setFileError(true))
      .finally(() => {
        setIsAnalysed(true);
        setIsAnalysing(false);
      });
  };

  const onAnalysisValidation = () => {
    setIsImporting(true);
    bulkImport(state, type)
      .then((bulkResult) => {
        setState(bulkResult);
      })
      .catch(() => setFileError(true))
      .finally(() => {
        setIsImporting(false);
        setIsImported(true);
      });
  };

  const forceWarning = (index) => {
    const updated = state.map((elem) => {
      if (elem.index === index) return { ...elem, status: elem.status === 'warning' ? 'success' : 'warning' };
      return elem;
    });
    setState(updated);
  };

  useEffect(() => onReset(), [type]);

  return (
    <Container fluid className="fr-my-3w">
      <Row justifyContent="center">
        <Col>
          <Stepper
            currentStep={step}
            steps={steps.length}
            currentTitle={`${steps[step - 1]} de ${type}`}
            nextStepTitle={steps[step]}
          />
        </Col>
      </Row>
      {(step === 1) && (
        <FormStep
          type={type}
          defaultInput={input}
          fileError={fileError}
          onInputValidation={onInputValidation}
        />
      )}
      {(step === 2) && (
        <Row alignItems="middle" justifyContent="center">
          <PageSpinner size={50} />
          <Text as="p">Analyse des données en cours. Veuillez patienter...</Text>
        </Row>
      )}
      {(step === 3) && (
        <AnalyseStep
          type={type}
          state={state}
          forceWarning={forceWarning}
          onAnalysisValidation={onAnalysisValidation}
          onReset={onReset}
        />
      )}
      {(step === 4) && (
        <Row alignItems="middle" justifyContent="center">
          <PageSpinner size={50} />
          <Text as="p">Import des données en cours. Veuillez patienter...</Text>
        </Row>
      )}
      {(step === 5) && (
        <ReportStep
          type={type}
          state={state}
          onReset={onReset}
        />
      )}
    </Container>
  );
}

BulkImport.propTypes = {
  type: PropTypes.oneOf(['structures', 'personnes', 'gouvernance', 'lauréats', 'prix', 'terms']).isRequired,
};
