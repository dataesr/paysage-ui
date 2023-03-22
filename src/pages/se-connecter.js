import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, TextInput, Text, Link, Title, ButtonGroup, Stepper, Alert,
} from '@dataesr/react-dsfr';
import Button from '../components/button';
import useAuth from '../hooks/useAuth';
import { MAIL_REGEXP, PASSWORD_REGEXP, OTP_REGEXP } from '../utils/auth';
import usePageTitle from '../hooks/usePageTitle';

export default function SignIn() {
  usePageTitle('Se connecter');
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = () => MAIL_REGEXP.test(email);
  const validateOtp = () => OTP_REGEXP.test(otp);
  const validatePassword = () => PASSWORD_REGEXP.test(password);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!(validateEmail(email) && (validatePassword(password) === true))) {
      return setError('Mauvaise combinaison utilisateur/mot de passe');
    }
    const body = { email, password };
    if (otp) body.otp = otp;
    const response = await signin(body);
    if (response.status === 200) { return navigate('/'); }
    if (response.status === 202) { setError(''); return setStep(2); }
    return setError(response?.data?.error);
  };

  return (
    <Container spacing="my-6w">
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
                    nextStepTitle={(step === 1) ? 'Validation du code reçu par email' : ''}
                  />
                </Col>
              </Row>
              { (step === 1) && (
                <Row justifyContent="center">
                  <Col>
                    {(error) && <Alert description={error} type="error" />}
                    <form onSubmit={handleSignIn}>
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
                        spacing="mb-1v"
                      />
                      <Link size="sm" as={<RouterLink to="/mot-de-passe-oublie" />}>
                        Mot de passe oublié ?
                      </Link>
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
                    {(error) && <Alert description={error} type="error" />}
                    <form onSubmit={handleSignIn}>
                      <TextInput
                        required
                        label="Saisissez le code à 6 chiffres reçu par email"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.trim())}
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
