import {
  Badge,
  Breadcrumb, BreadcrumbItem,
  Container, Row, Col,
  Modal, ModalContent, ModalTitle,
  Text,
  TextInput,
  Title,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '../../components/button';
import GeographicalExceptionForm from '../../components/forms/geographical-exceptions';
import useFetch from '../../hooks/useFetch';
import useNotice from '../../hooks/useNotice';
import api from '../../utils/api';
import { toString } from '../../utils/dates';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../utils/notice-contents';
import { normalize } from '../../utils/strings';
import useDebounce from '../../hooks/useDebounce';

function getSearchableExceptions(exceptions) {
  const { nameFr, id } = exceptions.geographiCalcategory;
  const { displayName, id: structureId } = exceptions.resource;
  return normalize([nameFr, id, displayName, structureId].filter((elem) => elem).join(' '));
}

export default function GeographicalExceptionPage() {
  const route = '/geographical-exceptions';
  const { data, isLoading, error, reload } = useFetch('/geographical-exceptions');
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { notice } = useNotice();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

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
      <GeographicalExceptionForm
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

  // const filteredData = data.data;
  const filteredData = query
    ? data?.data?.filter((item) => getSearchableExceptions(item).includes(normalize(debouncedQuery)))
    : data?.data;

  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>Exceptions géographiques</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="flex--space-between flex--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Exceptions géographiques</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button color="success" className="fr-ml-1w" size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Nouvelle</Button>
      </Row>
      <hr />
      <Row>
        <TextInput placeholder="Filtrer" value={query} onChange={(e) => setQuery(e.target.value)} size="sm" />
      </Row>
      <hr />
      {filteredData?.map((item) => (
        <Container fluid key={item.id}>
          <Row className="flex--space-between">
            <Col className="flex--grow fr-pl-2w">
              <Row><Text spacing="my-1v" bold size="lg">{item?.geographiCalcategory?.nameFr}</Text></Row>
              <Row>
                <Text as="span" className="fr-mb-2v">
                  Liée à :
                  {' '}
                  <Text as="span" bold>
                    {item.resource.displayName}
                  </Text>
                  {' '}
                  <Badge text={item.resource.id} />
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
              <Button
                color="error"
                icon="ri-delete-bin-line"
                onClick={() => handleDelete(item.id)}
                secondary
                size="sm"
              >
                Supprimer
              </Button>
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
