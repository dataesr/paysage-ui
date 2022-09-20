import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, TextInput, Text, Link, Title, Breadcrumb, BreadcrumbItem, ButtonGroup, Stepper, Alert,
} from '@dataesr/react-dsfr';
import Button from '../components/button';
import useAuth from '../hooks/useAuth';
import { MAIL_REGEXP, PASSWORD_REGEXP, OTP_REGEXP } from '../utils/auth';
import useNotice from '../hooks/useNotice';

export default function SignIn() {
  const navigate = useNavigate();
  const { notice } = useNotice();
  const { requestSignInEmail, signin, viewer } = useAuth();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matchError, setMatchError] = useState(false);

  const validateEmail = () => MAIL_REGEXP.test(email);
  const validateOtp = () => OTP_REGEXP.test(otp);
  const validatePassword = () => PASSWORD_REGEXP.test(password);

  const requestOtp = async (e) => {
    e.preventDefault();
    if (validateEmail(email) && (validatePassword(password) === true)) {
      const response = await requestSignInEmail({ email, password });
      const serverMessage = /Un nouveau code à été envoyé/i;
      if (serverMessage.test(response.error)) { setStep(2); } else { setMatchError(true); }
    } else { setMatchError(true); }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();

    const response = await signin({ email, password, otp });
    if (response.ok) { navigate('/'); } else { notice({ content: response.data.message }); }
  };

  useEffect(() => {
    if (viewer?.id) { navigate('/'); }
  }, [viewer, navigate]);

  return (
    <Container spacing="mb-6w">
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-6">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem>Se connecter</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-6">
          <Title as="h1" look="h3">Se connecter à Paysage</Title>
        </Col>
      </Row>
      <Container fluid>
        <Row justifyContent="center">
          <Col n="xs-12 sm-10 md-8 lg-6">
            <Container fluid className="fr-background-alt" spacing="px-4w px-md-12w py-4w">
              <Row justifyContent="center">
                <Col>
                  <Stepper
                    currentStep={step}
                    steps={2}
                    currentTitle={(step === 1) ? 'Identifiants de connexion' : 'Validation du code reçu par email'}
                    nextStepTitle={(step === 1) && 'Validation du code reçu par email'}
                  />
                </Col>
              </Row>
              { (step === 1) && (
                <Row justifyContent="center">
                  <Col>
                    {matchError && <Alert description="Mauvaise combinaison Identifiant/Mot de passe " type="error" />}
                    <form onSubmit={requestOtp}>
                      <TextInput
                        required
                        label="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <TextInput
                        required
                        label="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        messageType=""
                        message={(
                          <Link size="sm" as={<RouterLink to="/mot-de-passe-oublie" />}>
                            Mot de passe oublié ?
                          </Link>
                        )}
                        spacing="mb-1v"
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
                        <Text bold size="lg">Vous n'avez pas encore de compte ?</Text>
                      </Col>
                      <Col n="12">
                        <ButtonGroup>
                          <Button as="a" secondary onClick={() => navigate('/creer-un-compte')}>
                            Créer un compte
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
              { (step === 2) && (
                <Row justifyContent="center">
                  <Col>
                    <form onSubmit={handleSignIn}>
                      <TextInput
                        required
                        label="Saisissez le code à 6 chiffres reçu par email"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onBlur={validateOtp}
                      />
                      <Row spacing="my-2w">
                        <Col>
                          <ButtonGroup>
                            <Button submit>
                              Se connecter
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                      <Text>
                        Si vous n'avez pas reçu un email après 5 minutes,
                        <Link href="/se-connecter"> cliquez ici.</Link>
                      </Text>
                    </form>
                  </Col>
                </Row>
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
