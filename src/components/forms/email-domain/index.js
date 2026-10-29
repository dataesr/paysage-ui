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
import useForm from '../../../hooks/useForm';
import { EMAIL_DOMAIN_TYPES } from '../../blocs/email-domains/constants';

// Same format as the one the API checks.
const DOMAIN_REGEXP = /^[a-z0-9.-]+\.[a-z]{2,}$/;

// Domain names are case insensitive: "@Univ-Paris.fr" is univ-paris.fr.
const normalize = (domainName) => (domainName || '').trim().toLowerCase().replace(/^@/, '');

function validate(body) {
  const validationErrors = {};
  const domainName = normalize(body.domainName);
  if (!domainName) { validationErrors.domainName = 'Le nom de domaine est obligatoire.'; }
  if (domainName && !DOMAIN_REGEXP.test(domainName)) { validationErrors.domainName = "Le nom de domaine n'est pas valide."; }
  if (!body.type) { validationErrors.type = 'Le type est obligatoire.'; }
  return validationErrors;
}

export default function EmailDomainForm({ onSave }) {
  const { form, updateForm, errors } = useForm({ domainName: '', type: 'primary' }, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    return onSave({ domainName: normalize(form.domainName), type: form.type });
  };

  const typesOptions = Object.entries(EMAIL_DOMAIN_TYPES).map(([value, label]) => ({ value, label }));

  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <TextInput
              required
              label="Nom de domaine"
              hint="Ce qui suit le @ dans les adresses email de la structure, par exemple univ-paris.fr"
              value={form.domainName}
              onChange={(e) => updateForm({ domainName: e.target.value })}
              message={(showErrors && errors.domainName) ? errors.domainName : null}
              messageType={(showErrors && errors.domainName) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <Select
              required
              label="Type"
              options={typesOptions}
              selected={form.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
            />
          </Col>
        </Row>
        <FormFooter onSaveHandler={handleSubmit} />
      </Container>
    </form>
  );
}

EmailDomainForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};
