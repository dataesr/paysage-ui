import { Breadcrumb, BreadcrumbItem, Col, Container, Row, TextInput, Title } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useToast from '../hooks/useToast';

import FormFooter from '../components/forms/form-footer';
import useForm from '../hooks/useForm';
import useAuth from '../hooks/useAuth';

function validate(body) {
  const validationErrors = {};
  if (!body.message) { validationErrors.message = 'Veuillez écrire votre message'; }
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
  const { viewer } = useAuth();
  const initialForm = viewer?.id
    ? { name: `${viewer.firstName} ${viewer.lastName}`.trim(), organization: viewer?.service, fonction: viewer?.position, email: viewer?.email }
    : {};
  const { form, updateForm, errors } = useForm(initialForm, validate);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    api.post('/contacts', body)
      .then((response) => {
        setValidationMessage(response.data.message);
        toast({ toastType: 'success', description: 'Votre message a bien été envoyé' });
        navigate('/');
      })
      .catch(() => {
        toast({ toastType: 'error', description: "Une erreur s'est produite" });
      });
    return validationMessage;
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
                    disabled
                  />
                  <TextInput
                    label="Votre email"
                    value={form.email || ''}
                    disabled
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
