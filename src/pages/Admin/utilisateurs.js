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
  ModalTitle,
  Row,
  Text,
  Title,
} from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import useFetch from '../../hooks/useFetch';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';

import { toString } from '../../utils/dates';

function User({
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
            <Icon size="md" name="ri-mail-fill" />
            {email}
          </Text>
          {(service || position) && (
            <Text spacing="m-0" size="sm">
              <Icon size="md" name="ri-government-line" />
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
            {(!confirmed) && <Button icon="ri-check-double-line" onClick={() => handleActivateUser(id)}>Activer</Button>}
            <Button secondary title="editer" icon="ri-pencil-line" onClick={() => setIsEditModalOpen(!isEditModalOpen)}>Editer</Button>
            {/* <Button secondary colors={['var(--background-action-high-error)', 'white']} title="supprimer" icon="ri-delete-bin-line">Supprimer</Button> */}
          </ButtonGroup>
        </div>
      </Row>
      <Modal isOpen={isEditModalOpen} size="md" hide={() => setIsEditModalOpen(false)}>
        <ModalTitle>Editer </ModalTitle>
        <ModalContent>
          {`${firstName} ${lastName}`}
          <Button onClick={() => handleEditUser(id, newRole)} />
        </ModalContent>
      </Modal>
      <hr />
    </Col>
  );
}
User.propTypes = {
  handleEditUser: PropTypes.func.isRequired,
  handleActivateUser: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  confirmed: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  service: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  deleted: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  updatedBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

export default function UsersManagment() {
  const { toast } = useToast();
  const { data, isLoading, error, reload } = useFetch('GET', '/admin/users?sort=-createdAt');

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
          <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
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
            {...item}
          />
        ))}
      </Row>
    </Container>
  );
}
