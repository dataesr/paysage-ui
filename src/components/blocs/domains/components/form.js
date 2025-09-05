import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import useForm from '../../../../hooks/useForm';
import FormFooter from '../../../forms/form-footer';

function validate(body) {
  const validationErrors = {};
  if (!body.domainName) { validationErrors.domainName = "L'utilisateur doit être sélectionné"; }
  return validationErrors;
}

function sanitize(form) {
  const fields = ['domainName', 'archived'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function DomainsForm({ onSave }) {
  const { form, updateForm, errors } = useForm({ role: 'reader' }, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body);
  };

  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <TextInput
              label="Nom de la clé"
              required
              value={form.domainName}
              onChange={(e) => updateForm({ domainName: e.target.value })}
              message={(showErrors && errors.domainName) ? errors.domainName : null}
              messageType={(showErrors && errors.domainName) ? 'error' : ''}
            />
          </Col>
        </Row>
        <FormFooter onSaveHandler={handleSubmit} />
      </Container>
    </form>
  );
}
DomainsForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};
