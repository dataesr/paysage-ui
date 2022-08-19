import {
  Checkbox,
  Col,
  Callout,
  Row,
  Text,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import { useState } from 'react';
import { getApproximativeDate, validDate } from '../../utils/dates';

import styles from './DateOneField.module.scss';

export default function DateOneField({
  value,
  name,
  label,
  onValueChangeHandler,
  isRequired,
}) {
  const [CKDateField, setCKDateField] = useState(false);

  const onChangeHandler = (key, event) => {
    if (validDate(event.target.value)) {
      onValueChangeHandler(event.target.value);
    }
  };

  return (
    <Col n="12">
      <Callout hasInfoIcon={false}>
        <Row>
          <Col>
            <Text>{label}</Text>
          </Col>
          <Col>
            <Checkbox
              label="Approximative"
              value={CKDateField}
              onChange={() => setCKDateField(!CKDateField)}
            />
          </Col>
        </Row>
        <Row>
          <Col n="6">
            <TextInput
              className={styles.TextInput}
              type="date"
              value={value}
              name={name}
              onChange={(e) => onChangeHandler(name, e)}
              isRequired={isRequired}
            />
          </Col>
          {CKDateField ? <Col>{getApproximativeDate(value)}</Col> : null}
        </Row>
      </Callout>
    </Col>
  );
}

DateOneField.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onValueChangeHandler: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
};

DateOneField.defaultProps = {
  isRequired: false,
};
