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
import { useState } from 'react';

import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const ret = {};
  if (!body?.type) ret.type = "Le type de l'identifiant est obligatoire";
  if (!body?.value) ret.value = "La valeur de l'identifiant est obligatoire";
  return ret;
}

function sanitize(form) {
  const fields = ['active', 'endDate', 'startDate', 'type', 'value'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function IdentifierForm({ id, data, onDelete, onSave, options }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm({ active: true, ...data }, validate);

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  return (
    <form>
      <Container fluid>
        <PaysageBlame
          createdBy={data.createdBy}
          updatedBy={data.updatedBy}
          updatedAt={data.updatedAt}
          createdAt={data.createdAt}
        />
        <Row gutters>
          <Col n="12">
            <RadioGroup isInline>
              <Radio
                label="Actif"
                value
                checked={form?.active}
                onChange={() => updateForm({ active: true })}
              />
              <Radio
                label="Inactif"
                value={false}
                checked={!form?.active}
                onChange={() => updateForm({ active: false })}
              />
            </RadioGroup>
          </Col>
          <Col n="12">
            <Select
              label="Type"
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
              onChange={(e) => updateForm({ type: e.target.value })}
              options={options}
              required
              selected={form?.type}
              tabIndex={0}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Valeur"
              message={(showErrors && errors.value) ? errors.value : null}
              messageType={(showErrors && errors.value) ? 'error' : ''}
              onChange={(e) => updateForm({ value: e.target.value })}
              required
              value={form?.value}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form?.startDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ startDate: value })}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form?.endDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ endDate: value })}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

IdentifierForm.propTypes = {
  options: PropTypes.object.isRequired,
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

IdentifierForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
