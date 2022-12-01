// TODO: Put the form in /components/forms !?
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, TextInput, Title } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../utils/api';

import FormFooter from '../components/forms/form-footer';
import useForm from '../hooks/useForm';
import useAuth from '../hooks/useAuth';

function validate(body) {
  const validationErrors = {};
  if (!body.name) { validationErrors.name = 'Votre nom est obligatoire.'; }
  if (!body.email) { validationErrors.email = "L'email de contact est obligatoire."; }
  if (!body.message) { validationErrors.message = 'Veuillez écrire ici votre message'; }
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
  return body;
}

export default function ContactPage() {
  // Prefill form if user is connected
  const { viewer } = useAuth();
  const initialForm = viewer?.id
    ? { name: `${viewer.firstName} ${viewer.lastName}`.trim(), organization: viewer?.service, fonction: viewer?.position, email: viewer?.email }
    : {};
  const { form, updateForm, errors } = useForm(initialForm, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    // TODO: Send sanitized body, not form
    // eslint-disable-next-line
    const body = sanitize(form);
    api.post('/contact', form)
      .then((response) =>
      // eslint-disable-next-line
      { console.log(response); })
      // eslint-disable-next-line
      .catch((e) => { console.log(e); });
    return null;
    // TODO: Set a state 'step' to 2 and display success page if step = 2
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
                onSaveHandler={handleSubmit}
              />
            </Container>
          </form>
        </Col>
      </Row>
    </Container>
  );
}
