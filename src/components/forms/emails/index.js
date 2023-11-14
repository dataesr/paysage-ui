import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import PropTypes from 'prop-types';
import FormFooter from '../form-footer';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';
import validateEmail from '../../../utils/mail-validation';

function validate(body) {
  const validationErrors = {};
  if (!body.emailTypeId) { validationErrors.emailTypeId = 'Le type est obligatoire'; }
  if (!body.email) { validationErrors.email = 'Un email est obligatoire.'; }
  if (!validateEmail(body.email) && body.email) { validationErrors.email = "L'adresse mail n'est pas valide."; }

  return validationErrors;
}

function sanitize(form) {
  const fields = ['emailTypeId', 'email'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function EmailForm({ id, data, onDelete, onSave }) {
  const { data: emailTypes } = useFetch('/email-types?limit=500');
  const { form, updateForm, errors } = useForm(data, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  const emailTypesOptions = (emailTypes?.data) ? [
    { label: "Sélectionner un type d'email", value: '' }, ...emailTypes.data.map((element) => ({ label: element.usualName, value: element.id })),
  ] : [{ label: "Sélectionner un type d'email", value: '' }];

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
            <Select
              required
              label="Type"
              options={emailTypesOptions}
              selected={form.emailTypeId || data.emailType?.id}
              onChange={(e) => updateForm({ emailTypeId: e.target.value })}
              message={(showErrors && errors.emailTypeId) ? errors.emailTypeId : null}
              messageType={(showErrors && errors.emailTypeId) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <TextInput
              required
              label="Email"
              value={form.email || ''}
              onChange={(e) => updateForm({ email: e.target.value })}
              message={(showErrors && errors.email) ? errors.email : null}
              messageType={(showErrors && errors.email) ? 'error' : ''}
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

EmailForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

EmailForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
