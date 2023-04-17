import { Col, Container, Row, Stepper, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { PageSpinner } from '../spinner';
import AnalyseStep from './components/analyse-step';
import FormStep from './components/form-step';
import ReportStep from './components/report-step';
import analyse from './lib/analysers';
import { fakeResults } from './mock';

const steps = ['Ajouter des données', 'Analyse des données', "Rapport d'analyse", 'Import des données', "Rapport d'importation"];

export default function BulkImport({ type }) {
  const [input, setInput] = useState();
  const [analysis, setAnalysis] = useState();
  const [isAnalysing, setIsAnalysing] = useState();
  const [isAnalysed, setIsAnalysed] = useState();
  const [fileError, setFileError] = useState();
  const [isImporting, setIsImporting] = useState();
  const [results, setResults] = useState();

  const step = useMemo(() => {
    if (isAnalysing) return 2;
    if (isImporting) return 4;
    if (results) return 5;
    if (isAnalysed) return 3;
    return 1;
  }, [results, isAnalysing, isAnalysed, isImporting]);

  const onReset = () => {
    setInput(undefined);
    setAnalysis(undefined);
    setIsAnalysing(undefined);
    setIsAnalysed(undefined);
    setFileError(undefined);
    setIsImporting(undefined);
    setResults(undefined);
  };

  const onInputValidation = async (userInput) => {
    setInput(userInput);
    setIsAnalysing(true);
    analyse(userInput, type)
      .then((analysed) => {
        setAnalysis(analysed);
      })
      .catch(() => setFileError(true))
      .finally(() => {
        setIsAnalysed(true);
        setIsAnalysing(false);
      });
  };

  const onAnalysisValidation = () => {
    setIsImporting(true);
    setTimeout(() => {
      setResults(fakeResults);
      setIsImporting(false);
    }, 2000);
  };

  const forceWarning = (index) => {
    const updated = analysis.map((elem) => {
      if (elem.index === index) return { ...elem, status: elem.status === 'warning' ? 'success' : 'warning' };
      return elem;
    });
    setAnalysis(updated);
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
          analysis={analysis}
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
        <ReportStep type={type} />
      )}
    </Container>
  );
}

BulkImport.propTypes = {
  type: PropTypes.oneOf(['structures', 'personnes', 'gouvernance', 'lauréats']).isRequired,
};
