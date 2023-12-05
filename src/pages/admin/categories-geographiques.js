import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Modal, ModalContent, ModalTitle, Row, Tag, Text, TextInput, Title } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '../../components/button';
import GeographicalCategoriesForm from '../../components/forms/geographical-categories';
import useFetch from '../../hooks/useFetch';
import useNotice from '../../hooks/useNotice';
import api from '../../utils/api';
import { toString } from '../../utils/dates';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../utils/notice-contents';
import { Spinner } from '../../components/spinner';
import { GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER } from '../../utils/constants';

export default function GeographicalCategories() {
  const route = '/geographical-categories';
  const { data, isLoading, error, reload } = useFetch(`${route}?limit=500&sort=priority`);
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { notice } = useNotice();
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data?.data);

  const handleFilter = () => {
    const filtered = data.data.filter((item) => item.nameFr.toLowerCase().includes(query.toLowerCase()));
    setFilteredData(filtered);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    handleFilter();
  };

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
      <GeographicalCategoriesForm
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
  if (isLoading) return <Spinner />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Catégories géographiques</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="flex--space-between flex--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Catégories géographiques</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button color="success" className="fr-ml-1w" size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Nouveau</Button>
      </Row>
      <hr />
      <Row>
        <Col>
          <TextInput placeholder="Filtrer par nom de catégories géographique" value={query} onChange={handleQueryChange} size="sm" />
        </Col>
      </Row>
      <hr />
      {filteredData?.map((item) => (
        <Container fluid key={item.id}>
          <Row className="flex--space-between">
            <Col className="flex--grow fr-pl-2w">
              <Row><Text spacing="my-1v" bold size="lg">{item.name}</Text></Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Niveau :
                  {' '}
                  <Badge text={GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[item.level]} />
                </Text>
              </Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Nom :
                  <Tag key={item.nameFr} as="span">{item.nameFr}</Tag>
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
