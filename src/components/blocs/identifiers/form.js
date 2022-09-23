import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
  RadioGroup,
  Radio,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import DateInput from '../../date-input';
import FormFooter from '../../forms/form-footer/form-footer';

export default function IdentifierForm({ data, onDeleteHandler, onSaveHandler, enumKey }) {
  const [identifierType, setIdentifierType] = useState(null);
  const [identifierValue, setIdentifierValue] = useState(null);
  const [identifierActive, setIdentifierActive] = useState(null);
  const [identifierStartDate, setIdentifierStartDate] = useState(null);
  const [identifierEndDate, setIdentifierEndDate] = useState(null);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/docs/enums').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setOptions(
          response.data[enumKey].enum.map((item) => ({
            label: item,
            value: item,
          })),
        );
        if (!data) {
          // valeur par défaut
          setIdentifierType(response.data[enumKey].enum[0]);
        }
      }
    };
    getOptions();

    if (data) {
      setIdentifierType(data.type || null);
      setIdentifierValue(data.value || null);
      setIdentifierActive(data.active || null);
      setIdentifierStartDate(data.startDate || null);
      setIdentifierEndDate(data.endDate || null);
    }
  }, [data, enumKey]);

  const onSave = () => {
    const body = {
      type: identifierType,
      value: identifierValue,
      active: identifierActive,
      startDate: identifierStartDate,
      endDate: identifierEndDate,
    };
    onSaveHandler(body, data?.id || null);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <RadioGroup isInline>
              <Radio
                label="Actif"
                value
                checked={identifierActive}
                onChange={() => setIdentifierActive(true)}
              />
              <Radio
                label="Inactif"
                value={false}
                checked={!identifierActive}
                onChange={() => setIdentifierActive(false)}
              />
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              label="Type"
              options={options}
              selected={identifierType}
              onChange={(e) => setIdentifierType(e.target.value)}
              tanindex="0"
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <TextInput
              label="Valeur"
              value={identifierValue || ''}
              onChange={(e) => setIdentifierValue(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="fr-pt-3w">
          <Col>
            <DateInput
              value={identifierStartDate}
              label="Date de début"
              onDateChange={(v) => setIdentifierStartDate(v)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DateInput
              value={identifierEndDate}
              label="Date de fin"
              onDateChange={(v) => setIdentifierEndDate(v)}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={onSave}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

IdentifierForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
  enumKey: PropTypes.string.isRequired,
};

IdentifierForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
