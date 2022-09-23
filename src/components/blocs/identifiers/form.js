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
import validator from './validator';
import FormFooter from '../../forms/form-footer/form-footer';
import useForm from '../../../hooks/useForm';

export default function IdentifierForm({ data, onDeleteHandler, onSaveHandler, enumKey }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validator);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/docs/enums').catch((e) => { console.log(e); });
      if (response.ok) {
        setOptions(
          response.data[enumKey].enum.map((item) => ({
            label: item,
            value: item,
          })),
        );
        if (!data?.type) {
          updateForm({ type: response.data[enumKey].enum[0] });
        }
        if (!data?.active) {
          updateForm({ active: true });
        }
      }
    };
    getOptions();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, enumKey]);

  const onSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    return onSaveHandler(form);
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
                checked={form?.active}
                onChange={(e) => updateForm({ active: e.target.value })}
              />
              <Radio
                label="Inactif"
                value={false}
                checked={!form?.active}
                onChange={(e) => updateForm({ active: e.target.value })}
              />
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              label="Type"
              options={options}
              selected={form?.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              tabIndex={0}
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <TextInput
              label="Valeur"
              value={form?.value}
              onChange={(e) => updateForm({ value: e.target.value })}
              required
              message={(showErrors && errors.value) ? errors.value : null}
              messageType={(showErrors && errors.value) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row className="fr-pt-3w">
          <Col>
            <DateInput
              value={form?.startDate}
              label="Date de début"
              onChange={(value) => updateForm({ startDate: value })}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DateInput
              value={form?.endDate}
              label="Date de début"
              onChange={(value) => updateForm({ endDate: value })}
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
