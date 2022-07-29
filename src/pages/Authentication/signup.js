import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, TextInput, Text, Button, Link, Title,
} from '@dataesr/react-dsfr';
import useAuth from '../../hooks/useAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, viewer } = useAuth();
  if (viewer?.id) { navigate(-1); }
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState({});
  const [password, setPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({});
  const [firstName, setFirstName] = useState('');
  const [firstNameStatus, setFirstNameStatus] = useState({});
  const [lastName, setLastName] = useState('');
  const [lastNameStatus, setLastNameStatus] = useState({});

  const validateFirstName = () => {
    if (firstName.length >= 2) {
      setFirstNameStatus({});
    } else {
      setFirstNameStatus({ error: true, hint: 'Le prénom doit avoir au moins deux caractères' });
    }
  };
  const validateLastName = () => {
    if (lastName.length >= 2) {
      setLastNameStatus({});
    } else {
      setLastNameStatus({ error: true, hint: 'Le nom doit avoir au moins deux caractères' });
    }
  };
  const validateEmail = () => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regexp.test(email)) {
      setEmailStatus({ error: true, hint: "Veuillez entrer une forme d'email valide" });
    } else {
      setEmailStatus({});
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signup({
      email, password, firstName, lastName,
    });
    if (response.ok) { navigate('/bienvenue', { replace: true }); } else { console.log(response.data); }
  };

  return (
    <Container spacing="mt-10w">
      <Row>
        <Col n="xs-12 sm-10 md-8 lg-6">
          <Title as="h1">Créer un compte</Title>
        </Col>
      </Row>
      <Row>
        <Col n="xs-12 sm-10 md-8 lg-6">
          <form
            autoComplete="on"
            onSubmit={(e) => handleSubmit(e)}
          >
            <TextInput
              required
              label="Prénom"
              value={firstName}
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={validateFirstName}
              messageType={firstNameStatus.error ? 'error' : ''}
              message={firstNameStatus.hint}
            />
            <TextInput
              required
              label="Nom"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={validateLastName}
              messageType={lastNameStatus.error ? 'error' : ''}
              message={lastNameStatus.hint}
            />
            <TextInput
              required
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              messageType={emailStatus.error ? 'error' : ''}
              message={emailStatus.hint}
            />
            <TextInput
              required
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              onBlur={validatePassword}
              messageType={passwordStatus.error ? 'error' : ''}
              message={passwordStatus.hint}
            />
            <Button
              disabled={!((email && password && firstName && lastName && !emailStatus.error && !passwordStatus.error && !firstNameStatus.error && !lastNameStatus.error))}
              submit
            >
              Créer un compte
            </Button>
          </form>
          <Text>
            Déjà un compte ?
            {' '}
            <Link as={<RouterLink to="/se-connecter" />}>Connectez vous</Link>
          </Text>
        </Col>
      </Row>
    </Container>
  );
}
