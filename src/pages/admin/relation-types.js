import { Link as RouterLink } from 'react-router-dom';
import {
  Breadcrumb, BreadcrumbItem, Col, Container, Row, Text,
  Title, Modal, ModalTitle, ModalContent, Badge, Tag,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';
import { toString } from '../../utils/dates';
import Button from '../../components/button';
import RelationTypesForm from '../../components/forms/relation-types';
import useNotice from '../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../utils/notice-contents';

export default function RelationTypesPage() {
  const route = '/relation-types';
  const { data, isLoading, error, reload } = useFetch(`${route}?limit=500&sort=name`);
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { notice } = useNotice();

  const handleSave = async (body, itemId) => {
    const method = itemId ? 'patch' : 'post';
    const saveUrl = itemId ? `${route}/${itemId}` : route;
    await api[method](saveUrl, body)
      .then(() => {
        notice(saveSuccess);
        reload();
      })
      .catch(() => notice(saveError));
    return setIsOpen(false);
  };

  const handleDelete = async (itemId) => {
    await api.delete(`${route}/${itemId}`)
      .then(() => {
        notice(deleteSuccess);
        reload();
      })
      .catch(() => notice(deleteError));
    return setIsOpen(false);
  };

  const handleModalToggle = (item = {}) => {
    const { id, ...rest } = item;
    setModalContent(
      <RelationTypesForm
        id={id}
        data={rest}
        onDelete={handleDelete}
        onSave={handleSave}
      />,
    );
    setModalTitle(id ? 'Modifier' : 'Ajouter');
    setIsOpen(true);
  };

  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Types de relation</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="flex--space-between flex--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Types de relations</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button secondary size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Ajouter</Button>
      </Row>
      <hr />
      {data.data?.map((item) => (
        <Container fluid key={item.id}>
          <Row className="flex--space-between">
            <Col className="flex--grow fr-pl-2w">
              <Row><Text spacing="my-1v" bold size="lg">{item.name}</Text></Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Priorité :
                  {' '}
                  <Badge text={item.priority} />
                </Text>
              </Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Autres noms :
                  {' '}
                  {item.otherNames.length ? item.otherNames.map((name) => <Tag key={name} as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
                </Text>
              </Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Appliquable aux :
                  {' '}
                  {item.for.map((object) => <Tag key={object} as="span">{object}</Tag>)}
                </Text>
              </Row>
              <Row>
                <Text spacing="mt-2w mb-0" size="xs">
                  Créé le
                  {' '}
                  {toString(item.createdAt)}
                  {' par '}
                  {`${item.createdBy?.firstName} ${item.createdBy?.lastName}`}
                </Text>
                {item.updatedAt && (
                  <Text size="xs">
                    Modifié le
                    {' '}
                    {toString(item.updatedAt)}
                    {' par '}
                    {`${item.updatedBy?.firstName} ${item.updatedBy?.lastName}`}
                  </Text>
                )}
              </Row>
            </Col>
            <Col className="text-right">
              <Button size="sm" secondary icon="ri-edit-line" onClick={() => handleModalToggle(item)}>Editer</Button>
            </Col>
          </Row>
          <hr />
        </Container>
      ))}
      <Modal canClose={false} size="lg" isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>
          {modalTitle}
        </ModalTitle>
        <ModalContent>
          {modalContent}
        </ModalContent>
      </Modal>
    </Container>
  );
}
