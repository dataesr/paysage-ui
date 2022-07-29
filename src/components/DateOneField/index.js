import {
  Checkbox,
  Col,
  Callout,
  Row,
  Text,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { getApproximativeDate, validDate } from '../../utils/dates';

import styles from './DateOneField.module.scss';

export default function DateOneField({
  value,
  name,
  label,
  onValueChangeHandler,
}) {
  const [CKDateField, setCKDateField] = useState(false);

  const onChangeHandler = (key, event) => {
    if (validDate(event.target.value)) {
      onValueChangeHandler(key, event.target.value);
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
            />
          </Col>
          {CKDateField ? <Col>{getApproximativeDate(value)}</Col> : null}
        </Row>
      </Callout>
    </Col>
  );
}
