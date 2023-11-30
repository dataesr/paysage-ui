import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Modal, ModalTitle, ModalContent, Row, Tag, Text } from '@dataesr/react-dsfr';
import Button from '../../components/button';
import useFetch from '../../hooks/useFetch';
import GroupForm from '../../components/forms/groups';
import api from '../../utils/api';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../components/bloc';
import useNotice from '../../hooks/useNotice';
import { saveError, saveSuccess, deleteSuccess, deleteError } from '../../utils/notice-contents';
import useEditMode from '../../hooks/useEditMode';

export default function GroupsPage() {
  const url = '/groups';
  const { data, isLoading, error, reload } = useFetch(`${url}?limit=500`);
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { notice } = useNotice();
  const { setEditMode } = useEditMode();

  useEffect(() => setEditMode(true), [setEditMode]);

  const onSaveHandler = async (body, itemId) => {
    const method = itemId ? 'patch' : 'post';
    const saveUrl = itemId ? `${url}/${itemId}` : url;
    await api[method](saveUrl, body)
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setIsOpen(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .then(() => { notice(deleteSuccess); reload(); })
      .catch(() => notice(deleteError));
    return setIsOpen(false);
  };

  const handleModalToggle = (item = {}) => {
    const { id, ...rest } = item;
    setModalTitle(item?.id ? 'Modifier' : 'Ajouter');
    setModalContent(
      <GroupForm
        id={id}
        data={rest}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
      />,
    );
    setIsOpen(true);
  };

  const renderGroups = () => {
    if (!data || !data.data?.length) return null;
    return data.data.map((group) => (
      <Col n="12" key={group.id}>
        <Row className="flex--space-between">
          <div className="flex--grow fr-pl-2w">
            <Text spacing="my-1v" bold size="lg">{`${group.name} ${group.acronym ? `(${group.acronym})` : ''}`.trim()}</Text>
            <Text as="span" bold>
              Autres noms :
            </Text>
            {group.otherNames.length ? group.otherNames.map((name) => <Tag key="name" as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
          </div>
          <div>
            <Button size="sm" color="success" icon="ri-edit-line" onClick={() => handleModalToggle(group)}>Editer</Button>
          </div>
        </Row>
        <hr />
      </Col>
    ));
  };
  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
        <BreadcrumbItem>Groupes d'utilisateurs</BreadcrumbItem>
      </Breadcrumb>
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h1" look="h4">Groupes d'utilisateurs</BlocTitle>
        <BlocActionButton onClick={() => handleModalToggle()}>Créer un groupe</BlocActionButton>
        <BlocContent>{renderGroups()}</BlocContent>
        <BlocModal>
          <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
            <ModalTitle>{modalTitle}</ModalTitle>
            <ModalContent>{modalContent}</ModalContent>
          </Modal>
        </BlocModal>
      </Bloc>
    </>
  );
}
