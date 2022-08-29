import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, ButtonGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, Title, Text, TextInput, File } from '@dataesr/react-dsfr';
import useToast from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';
import Avatar from '../../components/Avatar';

export default function Profile() {
  const { toast } = useToast();
  const { viewer, setViewer } = useAuth();
  const [key, setKey] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [modifyAvatar, setModifyAvatar] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [firstNameErrorDisplay, setFirstNameErrorDisplay] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [lastNameErrorDisplay, setLastNameErrorDisplay] = useState(false);
  const [position, setPosition] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    if (firstName?.length >= 2) return setFirstNameError('');
    return setFirstNameError('Le prénom doit avoir au moins deux caractères');
  }, [firstName]);

  useEffect(() => {
    if (lastName?.length >= 2) return setLastNameError('');
    return setLastNameError('Le nom doit avoir au moins deux caractères');
  }, [lastName]);

  useEffect(() => {
    setFirstName(viewer.firstName);
    setLastName(viewer.lastName);
    setPosition(viewer.position);
    setService(viewer.service);
  }, [viewer]);

  if (!viewer?.id) return <Spinner size={48} />;

  const saveAvatar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', avatar);
    const response = await api.put('/me/avatar', formData, { 'Content-Type': 'multipart/form-data' });
    if (response.ok) {
      toast({ toastType: 'success', description: 'Les modifications ont été prises en compte' });
      setAvatar(null);
      setKey(key + 1);
      setModifyAvatar(false);
      return setViewer(response.data);
    }
    return toast({ toastType: 'error', description: "Une erreur s'est produite" });
  };

  const deleteAvatar = async (e) => {
    e.preventDefault();
    const response = await api.delete('/me/avatar');
    if (response.ok) {
      const { data } = await api.get('/me');
      setViewer(data);
      return toast({ toastType: 'success', description: 'Les modifications ont été prises en compte' });
    }
    return toast({ toastType: 'error', description: "Une erreur s'est produite" });
  };

  const saveInformations = async (e) => {
    e.preventDefault();
    const response = await api.patch('/me', { firstName, lastName, position, service });
    console.log(response.data);
    setViewer(response.data);
    if (response.ok) return toast({ toastType: 'success', description: 'Les modifications ont été prises en compte' });
    return toast({ toastType: 'error', description: "Une erreur s'est produite" });
  };
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
      </Breadcrumb>
      <Container fluid>
        <Row className="fr-pb-5w">
          <Title as="h2">Mon profil</Title>
        </Row>
        <Row className="fr-pb-5w">
          <Col n="12 md-6" spacing="px-2w">
            <Text bold size="lead">
              Avatar
            </Text>
            <Avatar name={viewer.firstName} size={256} src={avatar ? URL.createObjectURL(avatar) : `${viewer.avatar}?key=${key}`} />
            {(avatar) && (
              <ButtonGroup isInlineFrom="md" size="sm">
                <Button secondary onClick={() => { setAvatar(null); setModifyAvatar(false); }}>Annuler</Button>
                <Button submit onClick={saveAvatar}>Sauvegarder</Button>
              </ButtonGroup>
            )}
            {(viewer?.avatar && !avatar) && (
              <ButtonGroup isInlineFrom="md" size="sm">
                <Button secondary onClick={deleteAvatar}>Supprimer</Button>
                <Button onClick={() => setModifyAvatar(true)}>Modifier mon avatar</Button>
              </ButtonGroup>
            )}
            {(!viewer.avatar || modifyAvatar) && (
              <form>
                <File
                  label="Ajouter un avatar"
                  hint="Formats supportés : jpg, png, jpeg, svg. Préférez un format carré de 128px de coté minimum."
                  spacing="my-3w"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  multiple={false}
                  accept="image/*"
                />
              </form>
            )}
          </Col>
          <Col n="12 md-6" spacing="px-2w">
            <Text bold size="lead">Informations</Text>
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
      </Container>
    </>
  );
}
