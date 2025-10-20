import { useState } from 'react';
import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Modal, ModalContent, ModalTitle, Row, Tag, Text, TextInput, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Button from '../../components/button';
import useFetch from '../../hooks/useFetch';
import useNotice from '../../hooks/useNotice';
import api from '../../utils/api';
import { toString } from '../../utils/dates';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../utils/notice-contents';
import CopyButton from '../../components/copy/copy-button';
import { capitalize } from '../../utils/strings';
import { PageSpinner } from '../../components/spinner';
import EmailTypesForm from '../../components/forms/email-types';

export default function EmailTypesPage({ route }) {
  const { data, isLoading, error, reload } = useFetch(`${route}?limit=500`);
  const { notice } = useNotice();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data?.data.filter((item) => item.usualName.toLowerCase().includes(searchQuery.toLowerCase()));

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
    setModalTitle(item?.id ? 'Modifier' : 'Ajouter');
    setModalContent(
      <EmailTypesForm
        id={id}
        data={rest}
        onDelete={handleDelete}
        onSave={handleSave}
      />,
    );
    setIsOpen(true);
  };

  if (error) return <div>Erreur</div>;
  if (isLoading) return <PageSpinner />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Types d'email</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="flex--space-between flex--baseline">
        <Title className="fr-pr-1v" as="h1" look="h3">
          Types d'email
          <Badge type="info" text={data?.totalCount} />
        </Title>
        <Button color="success" size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Ajouter</Button>
      </Row>
      <Row alignItems="middle" spacing="mb-3v">
        <Col n="12">
          <Text className="fr-m-0" size="sm" as="span">
            <i>
              Filtrer par
              {' '}
              types d'email
              :
            </i>
          </Text>
          <TextInput
            type="text"
            placeholder="Filtrer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      {filteredData?.map((item) => (
        <>
          <Row className="flex--space-between">
            <Col className="flex--grow fr-pl-2w">
              <Text spacing="my-1v" bold size="lg">{capitalize(item.usualName)}</Text>
              <Text as="span" bold>
                Autres noms :
              </Text>
              {item.otherNames.length ? item.otherNames.map((name) => <Tag as="span">{capitalize(name)}</Tag>) : <Text as="span"> Aucun alias pour le moment</Text>}
              {item?.id && (
                <Row>
                  <Text as="span" bold className="fr-mb-2v">
                    ID :
                    {' '}
                    {item.id}
                    <CopyButton
                      copyText={item.id}
                      size="sm"
                    />
                  </Text>
                </Row>
              )}
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
            </Col>
            <div>
              <Button secondary size="sm" title="editer" icon="ri-edit-line" onClick={() => handleModalToggle(item)}>Editer</Button>
            </div>
          </Row>
          <hr />
        </>
      ))}
      <Modal size="lg" isOpen={isOpen} hide={() => setIsOpen(false)}>
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

EmailTypesPage.propTypes = {
  route: PropTypes.string.isRequired,
};
