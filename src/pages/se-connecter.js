import { Alert, ButtonGroup, Col, Container, Link, Row, Text, TextInput, Title } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Button from '../components/button';
import useAuth from '../hooks/useAuth';
import usePageTitle from '../hooks/usePageTitle';
import { MAIL_REGEXP, OTP_REGEXP, PASSWORD_REGEXP } from '../utils/auth';

export default function SignIn() {
  usePageTitle('Se connecter');
  const navigate = useNavigate();
  const { signin } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);

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
      <Container fluid>
        <Row justifyContent="center">
          <Col n="xs-12 sm-10 md-8 lg-6">
            <Container fluid className="fr-background-alt" spacing="px-4w px-md-12w pb-4w pt-6w">
              { (step === 1) && (
                <Row justifyContent="center">
                  <Col n="12">
                    <Title as="h1" look="h5">Se connecter à Paysage</Title>
                  </Col>

                  <Col>
                    {(error) && <Alert description={error} type="error" />}
                    <form onSubmit={handleSignIn}>
                      <TextInput
                        autoFocus
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
                  <Col n="12">
                    <Title as="h1" look="h5">Validation de l'adresse email</Title>
                  </Col>
                  <Col n="12">
                    <Text size="sm">
                      <i>
                        Un code vous a été envoyé par email à l'adresse
                        {' '}
                        {email}
                        .
                        Saisissez ce code afin de confirmer la validité de votre adresse email.
                      </i>
                    </Text>
                  </Col>
                  <Col>
                    {(error) && <Alert description={error} type="error" />}
                    <form onSubmit={handleSignIn}>
                      <TextInput
                        required
                        autoFocus
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
