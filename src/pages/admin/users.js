import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
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
  TagGroup,
  Tag,
} from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '../../components/avatar';
import useFetch from '../../hooks/useFetch';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';
import Button from '../../components/button';

import { toString } from '../../utils/dates';

function User({
  handleSwitchDeleteUser,
  handleEditUser,
  handleActivateUser,
  handleAddToGroup,
  handleDeleteFromGroup,
  handleAskForValidation,
  groupOptions,
  id,
  email,
  firstName,
  lastName,
  confirmed,
  role,
  avatar,
  service,
  position,
  groups,
  isDeleted,
  isOtpRequired,
  createdAt,
  updatedAt,
  updatedBy,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newRole, setNewRole] = useState(role);
  const [newGroup, setNewGroup] = useState(null);

  const roleOptions = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'user', label: 'Utilisateur' },
    { value: 'reader', label: 'Invité' },
  ];

  return (
    <Col n="12">
      <Row className="flex--space-between">
        <div>
          <Avatar name={`${firstName} ${lastName}`} src={avatar} />
        </div>
        <div className="flex--grow fr-pl-2w">
          <Text as="span" spacing="my-1v" bold size="lg">
            {`${firstName} ${lastName} `}
            {isDeleted && <Badge className="fr-mx-1v" hasIcon isSmall type="error" text="Supprimé" />}
            {(!confirmed && !isDeleted) && <Badge className="fr-mx-1v" hasIcon isSmall type="success" text="Nouveau" />}
            {(confirmed && !isDeleted) && <Badge className="fr-mx-1v" hasIcon isSmall type="info" text={role} />}
            {(confirmed && !isDeleted && !isOtpRequired) && <Badge className="fr-mx-1v" hasIcon isSmall type="success" text="email confirmé" />}
            {(confirmed && !isDeleted && isOtpRequired) && <Badge className="fr-mx-1v" hasIcon isSmall type="warning" text="email non confirmé" />}
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
          <Text spacing="mt-2w mb-0" bold>
            Groupes :
          </Text>
          {(groups?.length === 0) && (
            <Text>
              <i>Aucun groupe n'a été défini pour cet utilisateur.</i>
            </Text>
          )}
          {(groups?.length > 0) && (
            <TagGroup>
              {groups.map((group) => (<Tag key={group.id}>{group.acronym || group.name}</Tag>))}
            </TagGroup>
          )}
          <Text spacing="mt-2w mb-0" size="xs">
            Créé le
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
            {(!confirmed && !isDeleted) && (
              <Button
                icon="ri-check-double-line"
                color="success"
                onClick={() => handleActivateUser(id)}
              >
                Activer
              </Button>
            )}
            {(!isDeleted) && <Button secondary title="editer" icon="ri-edit-line" onClick={() => setIsEditModalOpen(!isEditModalOpen)}>Editer</Button>}
            {isDeleted && (
              <Button
                color="success"
                secondary
                icon="ri-check-double-line"
                onClick={() => handleSwitchDeleteUser(id, !isDeleted)}
              >
                Réactiver
              </Button>
            )}
          </ButtonGroup>
        </div>
      </Row>
      <Modal isOpen={isEditModalOpen} size="lg" hide={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <Container fluid>
            <Row>
              <Col n="12">
                <Title as="h2" look="h6">{`Modifier le rôle de ${firstName} ${lastName}`}</Title>
              </Col>
            </Row>
            <Row gutters alignItems="bottom">
              <Col n="12 md-6">
                <Select
                  label="Sélectionner un rôle"
                  selected={newRole}
                  onChange={(e) => { setNewRole(e.target.value); }}
                  options={roleOptions}
                />
              </Col>
              <Col n="12 md-6">
                <ButtonGroup alignItems="bottom" isInlineFrom="md">
                  <Button
                    className="fr-mb-0"
                    onClick={() => handleEditUser(id, newRole)}
                  >
                    Changer le rôle
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col n="12">
                <Title as="h2" look="h6">{`Modifier les groupes de ${firstName} ${lastName}`}</Title>
              </Col>
            </Row>
            <Row>
              <Col n="12">
                {groups?.length
                  ? (
                    <>
                      <Row>
                        <Text bold spacing="mb-1w">{`Groupes de ${firstName} ${lastName}`}</Text>
                      </Row>
                      <Row spacing="pb-3w" justifyContent="middle">
                        {groups?.map((group) => (
                          <>
                            <Text spacing="mb-0 mr-1w">
                              {group.acronym || group.name}
                            </Text>
                            <Button color="error" icon="ri-delete-bin-2-line" size="sm" tertiary rounded borderless onClick={() => handleDeleteFromGroup(group.id, id)} />
                          </>
                        ))}
                      </Row>
                    </>
                  )
                  : <Text>{`${firstName} ${lastName} n'appartient à aucun groupe pour le moment.`}</Text>}
              </Col>
            </Row>
            <Row gutters alignItems="bottom">
              <Col n="12 md-6">
                <Select
                  label="Sélectionner un groupe"
                  selected={newGroup || ''}
                  onChange={(e) => { setNewGroup(e.target.value); }}
                  options={groupOptions}
                />
              </Col>
              <Col n="12 md-6">
                <ButtonGroup alignItems="bottom" isInlineFrom="md">
                  <Button
                    className="fr-mb-0"
                    onClick={() => handleAddToGroup(newGroup, id)}
                  >
                    Ajouter
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            {!isOtpRequired && (
              <>
                <hr />
                <Title as="h2" look="h6">Demander une nouvelle validation de l'email</Title>
                <Text>Un nouveau code de confirmation sera demandé pour que l'utilisateur puisse continuer a utiliser l'application.</Text>
                <ButtonGroup isInlineFrom="md">
                  <Button
                    secondary
                    icon="ri-delete-bin-2-line"
                    onClick={() => handleAskForValidation(id)}
                  >
                    Demander une validation
                  </Button>
                </ButtonGroup>
              </>
            )}
            <hr />
            <Title as="h2" look="h6">{`Désactiver le compte de ${firstName} ${lastName}`}</Title>
            <Text>En désactivant un utilisateur, il sera marqué comme supprimé et ne pourra plus se connecter à Paysage.</Text>
            <ButtonGroup isInlineFrom="md">
              <Button
                secondary
                color="error"
                icon="ri-delete-bin-2-line"
                onClick={() => handleSwitchDeleteUser(id, !isDeleted)}
              >
                Supprimer l'utilisateur
              </Button>
            </ButtonGroup>
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
  groups: [],
  groupOptions: [],
  updatedBy: {
    firstName: null,
    lastName: null,
    avatar: null,
    id: null,
  },
};
User.propTypes = {
  handleEditUser: PropTypes.func.isRequired,
  handleAddToGroup: PropTypes.func.isRequired,
  handleDeleteFromGroup: PropTypes.func.isRequired,
  handleActivateUser: PropTypes.func.isRequired,
  handleSwitchDeleteUser: PropTypes.func.isRequired,
  handleAskForValidation: PropTypes.func.isRequired,
  groupOptions: PropTypes.array,
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  confirmed: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  service: PropTypes.string,
  position: PropTypes.string,
  isDeleted: PropTypes.bool.isRequired,
  isOtpRequired: PropTypes.bool.isRequired,
  groups: PropTypes.array,
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
  const { data, isLoading, error, reload } = useFetch('/admin/users?sort=-createdAt&limit=500');
  const { data: groups } = useFetch('/groups?limit=500');

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

  const handleSwitchDeleteUser = async (userId, isDeleted) => {
    const response = await api.patch(`/admin/users/${userId}`, { isDeleted }).catch(() => { toastError(); });
    if (!response.ok) return toastError();
    toast({ toastType: 'success', title: 'Utilisateur désactivé avec succès' });
    return reload();
  };

  const handleAskForValidation = async (userId) => {
    const response = await api.patch(`/admin/users/${userId}`, { isOtpRequired: true }).catch(() => { toastError(); });
    if (!response.ok) return toastError();
    toast({ toastType: 'success', title: "L'utilisateur devra valider son email lors de sa prochaine connexion" });
    return reload();
  };

  const handleActivateUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/confirm`).catch(() => { toastError(); });
    if (!response.ok) return toastError();
    toast({ toastType: 'success', title: 'Utilisateur activé avec succès' });
    return reload();
  };

  const handleAddToGroup = async (groupId, userId) => api.put(`/groups/${groupId}/members/${userId}`)
    .then(() => reload())
    .catch(() => toastError());

  const handleDeleteFromGroup = (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`)
    .then(() => reload())
    .catch(() => toastError());

  const groupes = groups?.data?.map((group) => ({ value: group.id, label: group.acronym || group.name })) || [];
  const groupOptions = [{ value: null, label: 'Sélectionner un groupe' }, ...groupes];

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
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Utilisateurs</Title>
          {(data?.totalCount) && <Badge type="info" text={data?.totalCount} />}
        </Row>
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
            handleAskForValidation={handleAskForValidation}
            handleAddToGroup={handleAddToGroup}
            handleDeleteFromGroup={handleDeleteFromGroup}
            groupOptions={groupOptions}
            {...item}
          />
        ))}
      </Row>
    </Container>
  );
}
