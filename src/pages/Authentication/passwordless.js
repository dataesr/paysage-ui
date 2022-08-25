import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, TextInput, Icon, Highlight, Text, Button, Link, Title, Breadcrumb, BreadcrumbItem, ButtonGroup, Stepper, Alert,
} from '@dataesr/react-dsfr';
import PasswordHint from '../../components/PasswordHint';
import useAuth from '../../hooks/useAuth';
import { MAIL_REGEXP, PASSWORD_REGEXP, OTP_REGEXP, getPasswordValidationInfo } from '../../utils/auth';

export default function Passwordless() {
  const navigate = useNavigate();
  const { requestPasswordChangeEmail, changePassword, viewer } = useAuth();
  // if (viewer?.id) { navigate('/'); }
  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpErrorDisplay, setOtpErrorDisplay] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailErrorDisplay, setEmailErrorDisplay] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(getPasswordValidationInfo(password));
  const [passwordErrorDisplay, setPasswordErrorDisplay] = useState('info');

  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('');
  const [passwordConfirmationErrorDisplay, setPasswordConfirmationErrorDisplay] = useState(false);

  const [requestOtpError, setRequestOtpError] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    if (emailError) return setEmailErrorDisplay(true);
    const response = await requestPasswordChangeEmail({ email });
    const newCode = /Un nouveau code à été envoyé/i;
    if (newCode.test(response.error)) return setStep(2);
    return setRequestOtpError("Une erreur s'est produite");
  };
  const handleValidateOTP = (e) => {
    e.preventDefault();
    if (otpError) return setOtpErrorDisplay(true);
    return setStep(3);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log('handleChangePassword');
    if (!PASSWORD_REGEXP.test(password)) return setPasswordErrorDisplay('error');
    if (passwordConfirmationError) return setPasswordConfirmationError('Les deux mots de passe ne correspondent pas');
    const response = await changePassword({ email, password, otp });
    if (!response?.error) return setStep(4);
    const codeInvalide = /Code invalide/i;
    if (codeInvalide.test(response.error)) {
      setOtpError(response.error);
      setOtpErrorDisplay(true);
      return setStep(2);
    }
    return setChangePasswordError("Une erreur s'est produite");
  };

  useEffect(() => {
    if (MAIL_REGEXP.test(email)) return setEmailError('');
    return setEmailError('Veuillez entrer une adresse email valide.');
  }, [email]);

  useEffect(() => {
    if (OTP_REGEXP.test(otp)) return setOtpError('');
    return setOtpError('Le code doit contenir exactement 6 chiffres');
  }, [otp]);

  useEffect(() => {
    if (password === passwordConfirmation) return setPasswordConfirmationError('');
    return setPasswordConfirmationError('Les deux mots de passe ne correspondent pas');
  }, [password, passwordConfirmation]);

  useEffect(() => setPasswordValidation(getPasswordValidationInfo(password)), [password]);

  return (
    <Container spacing="mb-6w">
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-6">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
            <BreadcrumbItem>Récupération de mot de passe</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-6">
          <Title as="h1" look="h3">Mot de passe oublié ?</Title>
        </Col>
      </Row>
      <Container fluid>
        <Row justifyContent="center">
          <Col n="xs-12 sm-10 md-8 lg-6">
            <Container fluid className="fr-background-alt" spacing="px-4w px-md-12w py-4w">
              {(step === 1) && (
                <>
                  <Row justifyContent="center">
                    <Col>
                      <Stepper
                        currentStep={step}
                        steps={4}
                        currentTitle="Identifiants du compte"
                        nextStepTitle="Validation du code reçu par email"
                      />
                    </Col>
                  </Row>
                  <Row justifyContent="center">
                    <Col>
                      {requestOtpError && <Alert title="Erreur" description={requestOtpError} type="error" isSmall />}
                      <form onSubmit={requestOtp}>
                        <TextInput
                          required
                          label="Adresse email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          messageType={(emailErrorDisplay && emailError) ? 'error' : ''}
                          message={(emailErrorDisplay && emailError) ? emailError : null}
                          onBlur={() => setEmailErrorDisplay(true)}
                        />
                        <Row spacing="my-2w">
                          <Col>
                            <ButtonGroup>
                              <Button submit>
                                Valider
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </form>
                      <hr />
                      <Row spacing="my-2w">
                        <Col n="12">
                          <Text bold size="lg">Vous avez retrouvé votre mot de passe ?</Text>
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
                        steps={4}
                        currentTitle="Validation du code reçu par email"
                        nextStepTitle="Renseigner un nouveau mot de passe"
                      />
                    </Col>
                  </Row>
                  <Row justifyContent="center">
                    <Col>
                      <form onSubmit={handleValidateOTP}>
                        <TextInput
                          required
                          label="Saisissez le code à 6 chiffres reçu par email"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          messageType={(otpErrorDisplay && otpError) ? 'error' : ''}
                          message={(otpErrorDisplay && otpError) ? otpError : null}
                          onBlur={() => setOtpErrorDisplay(true)}
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
                        <Text>
                          Si vous n'avez pas reçu un email après 5 minutes,
                          <Link href="/mot-de-passe-oublie"> cliquez ici.</Link>
                        </Text>
                      </form>
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
                        steps={4}
                        currentTitle="Renseigner un nouveau mot de passe"
                        nextStepTitle="Mot de passe réinitialisé"
                      />
                    </Col>
                  </Row>
                  <Row justifyContent="center">
                    <Col>
                      {changePasswordError && <Alert title="Erreur" description={changePasswordError} type="error" isSmall />}
                      <form onSubmit={handleChangePassword}>
                        <TextInput
                          required
                          label="Mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          messageType="success"
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
                        <TextInput
                          required
                          label="Confirmation du mot de passe"
                          hint="Veuillez confirmer le mot de passe en renseignant la même valeur que dans le champ 'Nouveau mot de passe'"
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          type="password"
                          messageType={(passwordConfirmationErrorDisplay && passwordConfirmationError) ? 'error' : ''}
                          message={(passwordConfirmationErrorDisplay && passwordConfirmationError) ? passwordConfirmationError : null}
                          onBlur={() => setPasswordConfirmationErrorDisplay(true)}
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
                    </Col>
                  </Row>
                </>
              )}
              {(step === 4) && (
                <>
                  <Row justifyContent="center">
                    <Col>
                      <Stepper
                        currentStep={step}
                        steps={4}
                        currentTitle="Mot de passe réinitialisé"
                        nextStepTitle=""
                      />
                    </Col>
                  </Row>
                  <Row spacing="py-6w">
                    <Icon
                      color="var(--border-default-green-emeraude)"
                      size="3x"
                      name="ri-checkbox-circle-fill"
                    />
                    <Text bold size="lg">Mot de passe réinitialisé !</Text>
                    <Highlight colorFamily="green-emeraude">
                      Votre mot de passe a été réinitialisé avec succès.
                      {' '}
                      <br />
                      Vous pouvez dès à présent utiliser ce mot de passe pour une nouvelle connexion.
                    </Highlight>
                  </Row>
                  <Row justifyContent="center">
                    <Col n="12">
                      <ButtonGroup>
                        <Button as="a" onClick={() => navigate('/se-connecter')}>
                          Connectez-vous
                        </Button>
                      </ButtonGroup>
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
