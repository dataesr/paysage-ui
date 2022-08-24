import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  ButtonGroup, Button, Breadcrumb, BreadcrumbItem, Container, Row, Col, TextInput, Text, Title, Icon, Stepper, Highlight,
} from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const MAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&:_])[A-Za-z\d@$!%*#?&:_]{8,}$/;

function PasswordHint({ display, hint }) {
  const icon = {
    info: 'ri-information-fill',
    success: 'ri-checkbox-circle-fill',
    error: 'ri-close-circle-fill',
  };
  return (
    <Text
      className={`fr-password-${display}`}
      size="xs"
    >
      <Icon
        color={`var(--${display}-main-525)`}
        size="lg"
        name={icon[display]}
      >
        {hint}
      </Icon>
    </Text>
  );
}
PasswordHint.propTypes = {
  hint: PropTypes.string.isRequired,
  display: PropTypes.oneOf(['error', 'info', 'success']).isRequired,
};

export default function SignUp() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, viewer } = useAuth();
  if (viewer?.id) { navigate('/'); }
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [firstNameErrorDisplay, setFirstNameErrorDisplay] = useState(false);
  useEffect(() => {
    if (firstName.length >= 2) return setFirstNameError('');
    return setFirstNameError('Le prénom doit avoir au moins deux caractères');
  }, [firstName]);

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [lastNameErrorDisplay, setLastNameErrorDisplay] = useState(false);
  useEffect(() => {
    if (lastName.length >= 2) return setLastNameError('');
    return setLastNameError('Le nom doit avoir au moins deux caractères');
  }, [lastName]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailErrorDisplay, setEmailErrorDisplay] = useState(false);
  useEffect(() => {
    if (MAIL_REGEXP.test(email)) return setEmailError('');
    return setEmailError('Veuillez entrer une adresse email valide.');
  }, [email]);

  const [password, setPassword] = useState('');
  const passwordValidatationInfo = (pwd) => ({
    uppercase: /(?=[A-Z])/.test(pwd),
    lowercase: /(?=[a-z])/.test(pwd),
    special: /(?=[@$!%*#?&:_])/.test(pwd),
    integer: /(?=\d)/.test(pwd),
    length: /[A-Za-z\d@$!%*#?&:_]{8,}/.test(pwd),
  });
  const [passwordValidation, setPasswordValidation] = useState(passwordValidatationInfo(password));
  const [passwordErrorDisplay, setPasswordErrorDisplay] = useState('info');
  useEffect(() => { setPasswordValidation(passwordValidatationInfo(password)); }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstNameError || lastNameError) {
      setFirstNameErrorDisplay(true);
      setLastNameErrorDisplay('true');
      return;
    }
    const response = await signup({
      email, password, firstName, lastName,
    });
    if (response.ok) { setStep(step + 1); return; }
    setStep(step - 1);
    toast({ toastType: 'error', title: 'Une erreur est survenue', description: response.data.error });
  };

  const nextStep = async (e) => {
    e.preventDefault();
    if (emailError || !PASSWORD_REGEXP.test(password)) {
      setEmailErrorDisplay(true);
      setPasswordErrorDisplay('error');
      return;
    }
    setStep(step + 1);
  };

  return (
    <Container spacing="mb-6w">
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-7">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
            <BreadcrumbItem>Créer un compte</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-7">
          <Title as="h1" look="h3">Création de compte sur Paysage</Title>
          <Text>
            Paysage est un service à destination des agents de la DGRI et de la DGSIP.
            Si vous ne faites pas partie de ces services, un administrateur du site devra valider votre inscription avant que votre première connexion soit possible.
          </Text>
        </Col>
      </Row>
      <Container fluid>
        <Row justifyContent="center">
          <Col n="xs-12 sm-10 md-8 lg-7">
            <Container fluid className="fr-background-alt" spacing="px-4w px-md-12w py-4w">
              {(step === 1) && (
                <>
                  <Row justifyContent="center">
                    <Col>
                      <Stepper
                        currentStep={step}
                        steps={3}
                        currentTitle="Identifiants de connexion"
                        nextStepTitle="Informations complémentaires"
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row justifyContent="center">
                    <Col>
                      <form onSubmit={nextStep}>
                        <TextInput
                          required
                          label="Identifiant"
                          type="email"
                          hint="Format attendu : nom@domaine.fr"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          messageType={(emailErrorDisplay && emailError) ? 'error' : null}
                          message={(emailErrorDisplay && emailError) ? emailError : null}
                          onBlur={() => setEmailErrorDisplay(true)}
                        />
                        <TextInput
                          required
                          label="Mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          messageType="info"
                          message={(
                            <Text size="xs">
                              Votre mot de passe doit contenir:
                              <br />
                              <PasswordHint display={(passwordValidation.length === true) ? 'success' : passwordErrorDisplay} hint="8 caractères minimum" />
                              <PasswordHint display={(passwordValidation.uppercase === true) ? 'success' : passwordErrorDisplay} hint="1 majuscule minimum" />
                              <PasswordHint display={(passwordValidation.lowercase === true) ? 'success' : passwordErrorDisplay} hint="1 miniscule minimum" />
                              <PasswordHint display={(passwordValidation.special === true) ? 'success' : passwordErrorDisplay} hint="1 caractère spécial minimum parmi @$!%*#?&:_" />
                              <PasswordHint display={(passwordValidation.integer === true) ? 'success' : passwordErrorDisplay} hint="1 chiffre minimum" />
                            </Text>
                          )}
                        />
                        <Row spacing="my-2w">
                          <Col>
                            <ButtonGroup>
                              <Button submit>
                                Suivant
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </form>
                      <hr />
                      <Row spacing="my-2w">
                        <Col n="12">
                          <Text bold size="lg">Vous avez déjà un compte ?</Text>
                        </Col>
                        <Col n="12">
                          <ButtonGroup>
                            <Button as="a" secondary onClick={() => navigate('/se-connecter')}>
                              Connectez-vous
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
              {(step === 2) && (
                <>
                  <Row justifyContent="center">
                    <Col>
                      <Stepper
                        currentStep={step}
                        steps={3}
                        currentTitle="Informations complémentaires"
                        nextStepTitle="Compte crée !"
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row justifyContent="center">
                    <Col>
                      <form onSubmit={handleSubmit}>
                        <TextInput
                          required
                          label="Prénom"
                          value={firstName}
                          type="text"
                          onChange={(e) => setFirstName(e.target.value)}
                          messageType={(firstNameErrorDisplay && firstNameError) ? 'error' : null}
                          message={(firstNameErrorDisplay && firstNameError) ? firstNameError : null}
                          onBlur={() => setFirstNameErrorDisplay(true)}
                        />
                        <TextInput
                          required
                          label="Nom"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          messageType={(lastNameErrorDisplay && lastNameError) ? 'error' : null}
                          message={(lastNameErrorDisplay && lastNameError) ? lastNameError : null}
                          onBlur={() => setLastNameErrorDisplay(true)}
                        />
                        <Row spacing="my-2w">
                          <Col>
                            <ButtonGroup className="fr-btns--space-between" isInlineFrom="sm">
                              <Button secondary icon="ri-arrow-drop-left-line" onClick={() => setStep(step - 1)}>
                                Précédent
                              </Button>
                              <Button submit>
                                Créer un compte
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </form>
                      <hr />
                      <Row spacing="my-2w">
                        <Col n="12">
                          <Text bold size="lg">Vous avez déjà un compte ?</Text>
                        </Col>
                        <Col n="12">
                          <ButtonGroup>
                            <Button as="a" secondary onClick={() => navigate('/se-connecter')}>
                              Connectez-vous
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
              {(step === 3) && (
                <>
                  <Row justifyContent="center">
                    <Col>
                      <Stepper
                        currentStep={step}
                        steps={3}
                        currentTitle="Compte crée"
                        nextStepTitle=""
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row spacing="py-6w">
                    <Icon
                      color="var(--border-default-green-emeraude)"
                      size="3x"
                      name="ri-checkbox-circle-fill"
                    />
                    <Text bold size="lg">Votre compte à été crée avec succès</Text>
                    <Highlight colorFamily="green-emeraude">
                      Votre compte viens d’être crée. Vous allez recevoir un premier email qui comfirera la prise en compte de votre inscription.
                      {' '}
                      <br />
                      <br />
                      Un administrateur doit valider votre inscription. Lorsque cela aura été fait, vous revevrez un autre email de confirmation et vous pourrez vous connecter.
                      {' '}
                      <br />
                      <br />
                      Cette procédure peut durer de 1 à 3 jours.
                    </Highlight>
                  </Row>
                  <Row justifyContent="end">
                    <Col n="12">
                      <Button as="a" secondary onClick={() => navigate('/')}>
                        Retour à l'acceuil
                      </Button>
                    </Col>
                  </Row>
                </>
              )}

            </Container>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
