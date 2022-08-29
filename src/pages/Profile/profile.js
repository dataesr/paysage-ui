import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, Title, Text, TextInput, File } from '@dataesr/react-dsfr';
import Sidemenu from '../../components/Sidemenu';
import useToast from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    viewer,
    // update,
  } = useAuth();

  useEffect(() => {
    if (!viewer?.id) navigate('/');
  }, [viewer, navigate]);

  const [avatar, setAvatar] = useState(null);
  const saveAvatar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', avatar[0]);
    console.log(formData);
    const response = await api.putFormData('/me/avatar', formData);
    console.log(response.data);
    if (response.ok) return toast({ toastType: 'success', description: 'Les modifications ont été prises en compte' });
    return toast({ toastType: 'error', description: "Une erreur s'est produite" });
  };
  const deleteAvatar = async (e) => {
    e.preventDefault();
    const response = await api.delete('/me/avatar');
    if (response.ok) return toast({ toastType: 'success', description: 'Les modifications ont été prises en compte' });
    return toast({ toastType: 'error', description: "Une erreur s'est produite" });
  };

  const [firstName, setFirstName] = useState(viewer.firstName);
  const [firstNameError, setFirstNameError] = useState('');
  const [firstNameErrorDisplay, setFirstNameErrorDisplay] = useState(false);
  useEffect(() => {
    if (firstName.length >= 2) return setFirstNameError('');
    return setFirstNameError('Le prénom doit avoir au moins deux caractères');
  }, [firstName]);

  const [lastName, setLastName] = useState(viewer.lastName);
  const [lastNameError, setLastNameError] = useState('');
  const [lastNameErrorDisplay, setLastNameErrorDisplay] = useState(false);
  useEffect(() => {
    if (lastName.length >= 2) return setLastNameError('');
    return setLastNameError('Le nom doit avoir au moins deux caractères');
  }, [lastName]);

  const [position, setPosition] = useState(viewer.position);
  const [service, setService] = useState(viewer.service);

  const saveInformations = async (e) => {
    e.preventDefault();
    const response = await api.patch('/me', { firstName, lastName, position, service });
    console.log(response.data);
    if (response.ok) return toast({ toastType: 'success', description: 'Les modifications ont été prises en compte' });
    return toast({ toastType: 'error', description: "Une erreur s'est produite" });
  };

  return (
    <Container spacing="mb-6w">
      <Row>
        <Col n="12 md-3">
          <Sidemenu />
        </Col>
        <Col n="12 md-9">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
          </Breadcrumb>
          <div className="fr-container-fluid" as="section" data-paysage-menu="Profile" id="profile">
            <Row className="fr-pb-5w">
              <Title as="h2">Mon profil</Title>
            </Row>
            <Row className="fr-pb-5w">
              <Col n="12 md-6" spacing="px-2w">
                <Text bold size="lg">Avatar</Text>
                {(viewer?.avatar && !avatar) && <img width={256} height={256} alt="avatar" src={viewer?.avatar} />}
                {avatar && <img width={256} height={256} alt="avatar" src={URL.createObjectURL(avatar[0])} />}
                <form onSubmit={saveAvatar}>
                  <File
                    spacing="my-3w"
                    onChange={(e) => setAvatar(e.target.files)}
                    multiple={false}
                  />
                  <ButtonGroup isInlineFrom="md">
                    <Button secondary onClick={deleteAvatar}>Supprimer</Button>
                    <Button submit>Sauvegarder</Button>
                  </ButtonGroup>
                </form>
              </Col>
              <Col n="12 md-6" spacing="px-2w">
                <Text bold size="lg">Informations</Text>
                <form onSubmit={saveInformations}>
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
                  <TextInput
                    label="Service"
                    value={service}
                    type="text"
                    onChange={(e) => setService(e.target.value)}
                  />
                  <TextInput
                    label="Poste actuel"
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                  <Row spacing="my-2w">
                    <Col>
                      <ButtonGroup isInlineFrom="md" align="right">
                        <Button submit>
                          Modifier le profil
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </div>
          <div className="fr-container-fluid" as="section" data-paysage-menu="Sécurité" id="securite">
            <Row className="fr-pb-5w">
              <Title as="h2">Sécurité</Title>
            </Row>
            <Row className="fr-pb-5w">
              <Col><Text>blah blah blah</Text></Col>
            </Row>
          </div>
          <div className="fr-container-fluid" as="section" data-paysage-menu="Groupes" id="groupes">
            <Row className="fr-pb-5w">
              <Title as="h2">Mes groupes</Title>
            </Row>
            <Row className="fr-pb-5w">
              <Col><Text>blah blah blah</Text></Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
