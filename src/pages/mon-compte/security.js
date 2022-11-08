import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, ButtonGroup, Col, Row, TextInput, Title, Text, Container } from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';
import { getPasswordValidationInfo } from '../../utils/auth';
import useForm from '../../hooks/useForm';
import useNotice from '../../hooks/useNotice';
import Button from '../../components/button';
import PasswordHint from '../../components/password-hint';
import api from '../../utils/api';

export default function SecurityPage() {
  const { viewer } = useAuth();
  const { notice } = useNotice();
  const validator = (body) => {
    const errors = { newPassword: getPasswordValidationInfo(body.newPassword) };
    const passwordValidationInfo = getPasswordValidationInfo(body.newPassword);
    errors.newPassword = passwordValidationInfo;
    if (body.newPassword !== body.passwordConfirmation) { errors.passwordConfirmation = 'Les deux mots de passe ne correspondent pas.'; }
    return errors;
  };
  const { form, updateForm, errors } = useForm({ newPassword: '' }, validator);
  const [showErrors, setShowErrors] = useState(false);
  const passwordErrorDisplay = showErrors ? 'error' : 'info';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (errors.passwordConfirmation) return setShowErrors(true);
    if (Object.values(errors.newPassword).filter((err) => (err !== true)).length !== 0) return setShowErrors(true);
    const { newPassword, currentPassword } = form;
    const errorNotice = { content: "Une erreur s'est produite. Le mot de passe n'a pas été modifié", autoDismissAfter: 6000, type: 'error' };
    const response = await api.put('/me/password', { newPassword, currentPassword }).catch(() => notice(errorNotice));
    if (!response.ok || response?.error) return notice(errorNotice);
    notice({ content: 'Votre mot de passe a été modifié avec succès !', autoDismissAfter: 6000, type: 'success' });
    return updateForm({ newPassword: '', currentPassword: '', passwordConfirmation: '' });
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/profile" />}>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
        <BreadcrumbItem>Sécurité</BreadcrumbItem>
      </Breadcrumb>
      <Container>
        <Row className="fr-pb-5w">
          <Col><Title as="h2">Sécurité</Title></Col>
        </Row>
        <Row>
          <Col><Title as="h3" look="h5">Changer mon mot de passe</Title></Col>
        </Row>
        <Row className="fr-pb-5w">
          <form onSubmit={handleChangePassword}>
            <TextInput
              required
              label="Mot de passe actuel"
              value={form.currentPassword || ''}
              onChange={(e) => updateForm({ currentPassword: e.target.value })}
              type="password"
            />
            <TextInput
              required
              label="Mot de passe"
              value={form.newPassword}
              onChange={(e) => updateForm({ newPassword: e.target.value })}
              type="password"
              messageType="success"
              message={(
                <Text size="xs">
                  Votre mot de passe doit contenir:
                  <br />
                  <PasswordHint display={(errors?.newPassword?.length === true) ? 'success' : passwordErrorDisplay} hint="8 caractères minimum" />
                  <PasswordHint display={(errors?.newPassword?.uppercase === true) ? 'success' : passwordErrorDisplay} hint="1 majuscule minimum" />
                  <PasswordHint display={(errors?.newPassword?.lowercase === true) ? 'success' : passwordErrorDisplay} hint="1 miniscule minimum" />
                  <PasswordHint display={(errors?.newPassword?.special === true) ? 'success' : passwordErrorDisplay} hint="1 caractère spécial minimum parmi @$!%*#?&:_." />
                  <PasswordHint display={(errors?.newPassword?.integer === true) ? 'success' : passwordErrorDisplay} hint="1 chiffre minimum" />
                </Text>
              )}
            />
            <TextInput
              required
              label="Confirmation du mot de passe"
              hint="Veuillez confirmer le mot de passe en renseignant la même valeur que dans le champ 'Nouveau mot de passe'"
              value={form.passwordConfirmation || ''}
              onChange={(e) => updateForm({ passwordConfirmation: e.target.value })}
              type="password"
              messageType={(showErrors && errors.passwordConfirmation) ? 'error' : ''}
              message={(showErrors && errors.passwordConfirmation) ? errors.passwordConfirmation : null}
            />
            <Row spacing="my-2w">
              <Col>
                <ButtonGroup>
                  <Button submit>
                    Changer mon mot de passe
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </form>
        </Row>
      </Container>
    </>
  );
}
