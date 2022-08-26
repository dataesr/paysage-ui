/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import { Button, Col, Row, Tag, TextInput } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Taginput({ label, values, hint, setValuesHandler }) {
  const [value, setValue] = useState(null);

  const addValues = () => {
    if (value) {
      const newValues = [...values];
      newValues.push(value);
      setValuesHandler(newValues);
      setValue('');
    }
  };

  const deleteValue = (valueToDelete) => {
    let newValues = [...values];
    newValues = newValues.filter((el) => el !== valueToDelete);
    console.log(valueToDelete, newValues);
    setValuesHandler(newValues);
  };

  return (
    <>
      <Row alignItems="bottom">
        <Col n="10">
          <TextInput
            value={value}
            label={label}
            hint={hint}
            onChange={(e) => setValue(e.target.value)}
          />
        </Col>
        <Col className="text-right">
          <Button onClick={() => addValues()}>Ajouter</Button>
        </Col>
      </Row>
      <Row>
        <Col className="fr-pt-2w">
          {values.map((item) => (
            <Tag
              key={uuidv4()}
              className="fr-mr-1w"
              closable
              onClick={() => deleteValue(item)}
            >
              {item}
            </Tag>
          ))}
        </Col>
      </Row>
    </>
  );
}

Taginput.propTypes = {
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string),
  setValuesHandler: PropTypes.func.isRequired,
};

Taginput.defaultProps = {
  hint: 'Validez votre ajout avec la touche "Entrée" afin de valider votre ajout',
  values: [],
};
