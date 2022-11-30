import { Breadcrumb, BreadcrumbItem, Col, Container, Row, TextInput, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../utils/api';

import FormFooter from '../components/forms/form-footer';
import useForm from '../hooks/useForm';

function validate(body) {
  const validationErrors = {};
  if (!body.name) { validationErrors.name = 'Votre nom est obligatoire.'; }
  if (!body.email) { validationErrors.email = "L'email de contact est obligatoire."; }
  if (!body.message) { validationErrors.message = 'Veuillez écrire ici votre message'; }
  const priority = parseInt(body.priority, 10);
  if (priority > 99 || priority < 1) { validationErrors.for = 'Doit être compris en 1 (priorité forte) et 99 (priorité faible)'; }
  return validationErrors;
}
function sanitize(form) {
  const fields = [
    'name',
    'organization',
    'fonction',
    'email',
    'message',
  ];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  body.priority = parseInt(body.priority, 10);
  return body;
}

export default function ContactPage({ id, onDelete, onSave }) {
  const { form, updateForm, errors } = useForm({}, validate);
  const [showErrors, setShowErrors] = useState(false);

  // const handleSubmit = () => {
  // if (Object.keys(errors).length > 0) return setShowErrors(true);
  //   const body = sanitize(form);
  // return onSave(body, id);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    api.post('/contact', form)
      .then((response) =>
      // eslint-disable-next-line
      { console.log(response); })
      .catch(() => { });
    return onSave(body, id);
  };

  return (
    <Container spacing="pb-6w">
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>
          Accueil
        </BreadcrumbItem>
        <BreadcrumbItem>
          Nous contacter
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Title as="h2" look="h5">
          Contact
        </Title>
      </Row>
      <Row>
        <Col n="12">
          <form>
            <Container fluid>
              <Row gutters>
                <Col n="12 md-6">
                  <TextInput
                    label="Votre nom et prénom"
                    value={form.name || ''}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    required
                    message={(showErrors && errors.name) ? errors.name : null}
                    messageType={(showErrors && errors.name) ? 'error' : ''}
                  />
                  <TextInput
                    label="Votre email"
                    value={form.email || ''}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    required
                    message={(showErrors && errors.email) ? errors.email : null}
                    messageType={(showErrors && errors.email) ? 'error' : ''}
                  />
                  <TextInput
                    label="Votre organisation"
                    value={form.organization || ''}
                    onChange={(e) => updateForm({ organization: e.target.value })}
                    message={(showErrors && errors.organization) ? errors.organization : null}
                    messageType={(showErrors && errors.organization) ? 'error' : ''}
                  />
                  <TextInput
                    label="Votre fonction"
                    value={form.fonction || ''}
                    onChange={(e) => updateForm({ fonction: e.target.value })}
                    message={(showErrors && errors.fonction) ? errors.fonction : null}
                    messageType={(showErrors && errors.fonction) ? 'error' : ''}
                  />
                </Col>
                <Col n="12 md-6">
                  <TextInput
                    label="Votre message"
                    value={form.message || ''}
                    onChange={(e) => updateForm({ message: e.target.value })}
                    required
                    message={(showErrors && errors.message) ? errors.message : null}
                    messageType={(showErrors && errors.message) ? 'error' : ''}
                    textarea
                    rows={13}
                  />
                </Col>
              </Row>
              <FormFooter
                buttonLabel="Envoyer"
                id={id}
                onSaveHandler={handleSubmit}
                onDeleteHandler={onDelete}
              />
            </Container>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

ContactPage.propTypes = {
  id: PropTypes.string,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};
ContactPage.defaultProps = {
  id: null,
  onDelete: null,
};
