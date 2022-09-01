import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Icon,
  Modal,
  ModalContent,
  Row,
  Select,
  Text,
  Title,
} from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '../../components/avatar';
import useFetch from '../../hooks/useFetch';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';

import { toString } from '../../utils/dates';

function User({
  handleSwitchDeleteUser,
  handleEditUser,
  handleActivateUser,
  id,
  email,
  firstName,
  lastName,
  confirmed,
  role,
  avatar,
  service,
  position,
  deleted,
  createdAt,
  updatedAt,
  updatedBy,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newRole, setNewRole] = useState(role);

  const roleOptions = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'user', label: 'Utilisateur' },
  ];

  return (
    <Col n="12">
      <Row className="fr-row--space-between">
        <div>
          <Avatar name={`${firstName} ${lastName}`} src={avatar} />
        </div>
        <div className="fr-col--grow fr-pl-2w">
          <Text spacing="my-1v" bold size="lg">
            {`${firstName} ${lastName} `}
            {deleted && <Badge className="fr-mx-1w" isSmall type="error" text="Supprimé" />}
            {(!confirmed) && <Badge isSmall type="success" text="Nouveau" />}
            {(confirmed && !deleted) && <Badge className="fr-mx-1w" isSmall type="info" text={role} />}
          </Text>
          <Text spacing="m-0" size="sm">
            <Icon size="1x" name="ri-mail-fill" />
            {email}
          </Text>
          {(service || position) && (
            <Text spacing="m-0" size="sm">
              <Icon size="1x" name="ri-government-line" />
              {service}
              {(service && position) && ' — '}
              {position}
            </Text>
          )}
          <Text spacing="mt-2w mb-0" size="xs">
            Crée le
            {' '}
            {toString(createdAt)}
          </Text>
          {updatedAt && (
            <Text size="xs">
              Modifié le
              {' '}
              {toString(updatedAt)}
              {' par '}
              {`${updatedBy.firstName} ${updatedBy.lastName}`}
            </Text>
          )}
        </div>
        <div>
          <ButtonGroup size="sm" isInlineFrom="xs">
            {(!confirmed && !deleted) && (
              <Button
                icon="ri-check-double-line"
                colors={['var(--background-action-high-success)', 'white']}
                onClick={() => handleActivateUser(id)}
              >
                Activer
              </Button>
            )}
            {(!deleted) && <Button secondary title="editer" icon="ri-pencil-line" onClick={() => setIsEditModalOpen(!isEditModalOpen)}>Editer</Button>}
            {deleted && (
              <Button
                colors={['var(--background-action-high-success)', 'white']}
                icon="ri-check-double-line"
                onClick={() => handleSwitchDeleteUser(id, !deleted)}
              >
                Réactiver
              </Button>
            )}
          </ButtonGroup>
        </div>
      </Row>
      <Modal isOpen={isEditModalOpen} size="md" hide={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <Container fluid>
            <Title as="h2" look="h6">{`Modifier le role de ${firstName} ${lastName}`}</Title>
            <Select
              label="Séléctionnez un role"
              selected={newRole}
              onChange={(e) => { setNewRole(e.target.value); }}
              options={roleOptions}
            />
            <Button onClick={() => handleEditUser(id, newRole)}>Changer le role</Button>
            <hr />
            <Title as="h2" look="h6">{`Désactiver le compte de ${firstName} ${lastName}`}</Title>
            <Text>En désactivant un utilisateur, il sera marqué comme supprimé et ne pourra plus se connecter à paysage.</Text>
            <Button
              secondary
              colors={['var(--background-action-high-error)', 'white']}
              onClick={() => handleSwitchDeleteUser(id, !deleted)}
            >
              Supprimer l'utilisateur
            </Button>
          </Container>
        </ModalContent>
      </Modal>
      <hr />
    </Col>
  );
}

User.defaultProps = {
  avatar: null,
  service: null,
  position: null,
  updatedBy: {
    firstName: null,
    lastName: null,
    avatar: null,
    id: null,
  },
};
User.propTypes = {
  handleEditUser: PropTypes.func.isRequired,
  handleActivateUser: PropTypes.func.isRequired,
  handleSwitchDeleteUser: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  confirmed: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  service: PropTypes.string,
  position: PropTypes.string,
  deleted: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  updatedBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default function AdminUsersPage() {
  const { toast } = useToast();
  const { data, isLoading, error, reload } = useFetch('/admin/users?sort=-createdAt');

  const toastError = () => toast({
    toastType: 'error',
    title: "Une erreur s'est produite",
    description: "Impossible de modifier l'utilisateur pour le moment. Rééssayez dans quelques instants. Si le problème persiste, contactez un administrateur.",
    autoDismissAfter: 8000,
  });

  const handleEditUser = async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}`, { role }).catch(() => { toastError(); });
    if (!response.ok) return toastError();
    toast({ toastType: 'success', title: 'Utilisateur activé avec succès' });
    return reload();
  };

  const handleSwitchDeleteUser = async (userId, deleted) => {
    console.log('deleted', deleted);
    const response = await api.patch(`/admin/users/${userId}`, { deleted }).catch(() => { toastError(); });
    if (!response.ok) return toastError();
    toast({ toastType: 'success', title: 'Utilisateur désactivé avec succès' });
    return reload();
  };

  const handleActivateUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/confirm`).catch(() => { toastError(); });
    if (!response.ok) return toastError();
    toast({ toastType: 'success', title: 'Utilisateur activé avec succès' });
    return reload();
  };

  return (
    <Container>
      <Row>
        <Breadcrumb>
          <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
          <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
          <BreadcrumbItem>Utilisateurs</BreadcrumbItem>
        </Breadcrumb>
      </Row>
      <Row spacing="mb-3w">
        <Title as="h2" look="h3">Utilisateurs Paysage</Title>
      </Row>
      <Row>
        {(error) && <div>Erreur</div>}
        {(isLoading) && <div>Chargement</div>}
        {(data) && data.data?.map((item) => (
          <User
            key={item.id}
            handleEditUser={handleEditUser}
            handleActivateUser={handleActivateUser}
            handleSwitchDeleteUser={handleSwitchDeleteUser}
            {...item}
          />
        ))}
      </Row>
    </Container>
  );
}
