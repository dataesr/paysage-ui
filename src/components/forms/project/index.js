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
  const fields = ['nameFr', 'nameEn', 'fullNameFr', 'fullNameEn', 'acronymFr', 'acronymEn', 'description', 'startDate', 'endDate', 'grantPart'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function ProjectForm({ id, data, onSave, onDelete }) {
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
              label="Nom en français"
              required
              value={form.nameFr || ''}
              onChange={(e) => updateForm({ nameFr: e.target.value })}
              message={(showErrors && errors.nameFr) ? errors.nameFr : null}
              messageType={(showErrors && errors.nameFr) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom en anglais"
              value={form.nameEn || ''}
              onChange={(e) => updateForm({ nameEn: e.target.value })}
              message={(showErrors && errors.nameEn) ? errors.nameEn : null}
              messageType={(showErrors && errors.nameEn) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom long en français"
              value={form.longNameFr || ''}
              onChange={(e) => updateForm({ longNameFr: e.target.value })}
              message={(showErrors && errors.longNameFr) ? errors.longNameFr : null}
              messageType={(showErrors && errors.longNameFr) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom long en anglais"
              value={form.longNameEn || ''}
              onChange={(e) => updateForm({ longNameEn: e.target.value })}
              message={(showErrors && errors.longNameEn) ? errors.longNameEn : null}
              messageType={(showErrors && errors.longNameEn) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Acronyme en français"
              value={form.acronymFr || ''}
              onChange={(e) => updateForm({ acronymFr: e.target.value })}
              message={(showErrors && errors.acronymFr) ? errors.acronymFr : null}
              messageType={(showErrors && errors.acronymFr) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Acronyme en anglais"
              value={form.acronymEn || ''}
              onChange={(e) => updateForm({ acronymEn: e.target.value })}
              message={(showErrors && errors.acronymEn) ? errors.acronymEn : null}
              messageType={(showErrors && errors.acronymEn) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              textarea
              label="Description"
              value={form.description || ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              message={(showErrors && errors.description) ? errors.description : null}
              messageType={(showErrors && errors.description) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Financement"
              value={form.grantPart || ''}
              onChange={(e) => updateForm({ grantPart: e.target.value })}
              message={(showErrors && errors.grantPart) ? errors.grantPart : null}
              messageType={(showErrors && errors.grantPart) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <DateInput
              value={form.startDate || ''}
              label="Date de début"
              onDateChange={((v) => updateForm({ startDate: v }))}
              message={(showErrors && errors.startDate) ? errors.startDate : null}
              messageType={(showErrors && errors.startDate) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
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

ProjectForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
ProjectForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
