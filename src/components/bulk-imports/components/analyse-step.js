import { ButtonGroup } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../button';
import Analysis from './analysis';

export default function AnalyseStep({ analysis, forceWarning, onAnalysisValidation, onReset }) {
  const success = analysis.filter((row) => row.status === 'success');
  const error = analysis.filter((row) => row.status === 'error');
  const warning = analysis.filter((row) => row.status === 'warning');
  return (
    <>
      <Analysis type="error" rows={error} />
      <Analysis type="warning" rows={warning} handleForceImport={forceWarning} />
      <Analysis type="success" rows={success} handleForceImport={forceWarning} />
      {(success.length > 0) && (
        <>
          <ButtonGroup>
            <Button onClick={() => onAnalysisValidation()}>
              Importer
              {' '}
              {success?.length || 0}
              {' '}
              objets
            </Button>
          </ButtonGroup>
          <p className="fr-hr-or">ou</p>
        </>
      )}
      <ButtonGroup>
        <Button secondary onClick={onReset}>
          Corriger mon fichier et recommencer
        </Button>
      </ButtonGroup>
    </>
  );
}

AnalyseStep.propTypes = {
  analysis: PropTypes.array.isRequired,
  forceWarning: PropTypes.func.isRequired,
  onAnalysisValidation: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
