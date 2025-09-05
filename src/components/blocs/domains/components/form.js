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
    const _body = {
      ...body,
      structures: [
        { structureId: 'Mz90U', type: 'primary' },
        { structureId: '69445', type: 'secondary' },
        { structureId: '77947', type: 'primary' },
        { structureId: 'xJdyB', type: 'secondary' },
        { structureId: 'Lr94O', type: 'primary' },
        { structureId: 'HqAYu', type: 'secondary' },
        { structureId: 'm7K6T', type: 'primary' },
        { structureId: 'ti37C', type: 'secondary' },
        { structureId: 'tIJ02', type: 'primary' },
        { structureId: 'cqkij', type: 'secondary' },
      ],
    };
    return onSave(_body);
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
