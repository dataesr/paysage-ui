import { ButtonGroup } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Button from '../../button';
import Report from './report';

export default function ReportStep({ state, onReset }) {
  const errors = state.filter((row) => row.imports?.status === 'error');
  const success = state.filter((row) => row.imports?.status === 'imported');

  return (
    <>
      <Report type="error" rows={errors} />
      <Report type="success" rows={success} />
      <ButtonGroup>
        <Button secondary onClick={onReset}>
          Terminer
        </Button>
      </ButtonGroup>
    </>
  );
}

ReportStep.propTypes = {
  state: PropTypes.array.isRequired,
  onReset: PropTypes.func.isRequired,
};
