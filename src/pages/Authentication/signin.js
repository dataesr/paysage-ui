import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, TextInput, Text, Button, Link, Title,
} from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';

export default function SignIn() {
  const navigate = useNavigate();
  const { requestSignInEmail, signin, viewer } = useAuth();
  if (viewer?.id) { navigate('/'); }
  const [view, setView] = useState(0);
  const [otpStatus, setOtpStatus] = useState({});
  const [otp, setOtp] = useState('');
  const [emailStatus, setEmailStatus] = useState({});
  const [email, setEmail] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({});
  const [password, setPassword] = useState('');
  const requestOtp = async (e) => {
    e.preventDefault();
    const response = await requestSignInEmail({ email, password });
    const serverMessage = /Un nouveau code à été envoyé/i;
    if (serverMessage.test(response.error)) { setView(1); } else { console.log(response); }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    const response = await signin({ email, password, otp });
    if (response.ok) { window.location.reload(false); } else { console.log(response); }
  };

  const validateEmail = () => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regexp.test(email)) {
      setEmailStatus({ error: true, hint: "Veuillez entrer une forme d'email valide" });
    } else {
      setEmailStatus({});
    }
  };
  const validateOtp = () => {
    const regexp = /^[0-9]{6}$/;
    if (!regexp.test(otp)) {
      setOtpStatus({ error: true, hint: 'Le code comporte 6 chiffres' });
    } else {
      setOtpStatus({});
    }
  };
  const validatePassword = () => {
    const regexp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&:_])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!regexp.test(password)) {
      setPasswordStatus({
        error: true,
        hint: 'Le mot de passe doit contenir 8 caractères, au moins une minuscule, une majuscule, un caractère spécial et un chiffre',
      });
    } else {
      setPasswordStatus({});
    }
  };

  return (
    <Container spacing="mt-10w">
      { view ? (
        <>
          <Row>
            <Col n="xs-12 sm-10 md-8 lg-6">
              <Title as="h1" look="h3">Entrez le code à 6 chiffres reçu par email</Title>
            </Col>
          </Row>
          <Row>
            <form onSubmit={handleSignIn}>
              <Col n="xs-12 sm-10 md-8 lg-6">
                <TextInput
                  label="Mot de passe unique"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onBlur={validateOtp}
                  messageType={otpStatus.error ? 'error' : ''}
                  message={otpStatus.hint}
                />
                <Button submit disabled={(otp.length !== 6)}>Valider</Button>
                <Text>Si vous n‘avez pas recu d‘email au bout de quelques minutes, cliquez ici</Text>
              </Col>
            </form>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col n="xs-12 sm-10 md-8 lg-6">
              <Title as="h1">Connectez-vous</Title>
            </Col>
          </Row>
          <Row>
            <Col n="xs-12 sm-10 md-8 lg-6">
              <form onSubmit={requestOtp}>
                <TextInput
                  label="Compte"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  messageType={emailStatus.error ? 'error' : ''}
                  message={emailStatus.hint}
                />
                <TextInput
                  label="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  onBlur={validatePassword}
                  messageType={passwordStatus.error ? 'error' : ''}
                  message={passwordStatus.hint}
                />
                <Button
                  submit
                  disabled={!((email && password && !emailStatus.error && !passwordStatus.error))}
                >
                  Se connecter
                </Button>
              </form>
              <Text>
                Pas encore de compte ?
                {' '}
                <Link as={<RouterLink to="/creer-un-compte" />}>Créez en un</Link>
              </Text>
            </Col>
          </Row>
        </>
      ) }
    </Container>
  );
}
