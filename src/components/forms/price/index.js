import PropTypes from 'prop-types';
import {
  Col,
  Container,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const validationErrors = {};
  if (!body.nameFr) validationErrors.nameFr = 'Le nom en français est obligatoire';
  return validationErrors;
}

function sanitize(form) {
  const fields = ['nameFr', 'nameEn', 'descriptionFr', 'descriptionEn', 'startDate', 'endDate'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function PriceForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm(data, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body);
  };
  return (
    <form>
      <PaysageBlame
        createdBy={data.createdBy}
        updatedBy={data.updatedBy}
        updatedAt={data.updatedAt}
        createdAt={data.createdAt}
      />
      <Container fluid>
        <Row gutters>
          <Col n="12 md-6">
            <TextInput
              label="Nom du prix en français"
              required
              value={form.nameFr || ''}
              onChange={(e) => updateForm({ nameFr: e.target.value })}
              message={(showErrors && errors.nameFr) ? errors.nameFr : null}
              messageType={(showErrors && errors.nameFr) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom du prix en anglais"
              value={form.nameEn || ''}
              onChange={(e) => updateForm({ nameEn: e.target.value })}
              message={(showErrors && errors.nameEn) ? errors.nameEn : null}
              messageType={(showErrors && errors.nameEn) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Description du prix en français"
              message={(showErrors && errors.descriptionFr) ? errors.descriptionFr : null}
              messageType={(showErrors && errors.descriptionFr) ? 'error' : ''}
              onChange={(e) => updateForm({ descriptionFr: e.target.value })}
              textarea
              value={form.descriptionFr || ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Description du prix en anglais"
              message={(showErrors && errors.descriptionEn) ? errors.descriptionEn : null}
              messageType={(showErrors && errors.descriptionEn) ? 'error' : ''}
              onChange={(e) => updateForm({ descriptionEn: e.target.value })}
              textarea
              value={form.descriptionEn || ''}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.startDate || ''}
              label="Date de début"
              onDateChange={((v) => updateForm({ startDate: v }))}
              message={(showErrors && errors.startDate) ? errors.startDate : null}
              messageType={(showErrors && errors.startDate) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.endDate || ''}
              label="Date de fin"
              onDateChange={((v) => updateForm({ endDate: v }))}
              message={(showErrors && errors.endDate) ? errors.endDate : null}
              messageType={(showErrors && errors.endDate) ? 'error' : ''}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

PriceForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
PriceForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
