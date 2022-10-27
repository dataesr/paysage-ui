import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Text, Title, Modal, ModalTitle, ModalContent, TextInput, Badge, Tag, ButtonGroup } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';
import TagInput from '../../components/tag-input';
import { toString } from '../../utils/dates';
import useForm from '../../hooks/useForm';
import Button from '../../components/button';

function NomenclatureForm({ id, data, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.usualName) { validationErrors.usualName = 'Le nom usuel est obligatoire'; }
    return validationErrors;
  };

  const { form, updateForm, errors } = useForm(data, validateForm);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    return onSave(id, form);
  };

  const handleDelete = () => onDelete(id);

  return (
    <form>
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Nom"
              required
              value={form.usualName || ''}
              onChange={(e) => updateForm({ usualName: e.target.value })}
              message={(showErrors && errors.usualName) ? errors.usualName : null}
              messageType={(showErrors && errors.usualName) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
              tags={form.otherNames}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
          <Col n="12">
            <ButtonGroup isInlineFrom="md" align="right">
              <Button onClick={handleSubmit} icon="ri-save-line">Enregistrer</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <hr />
        {id && (
          <>
            <Title as="h2" look="h6">Supprimer ce type de document</Title>
            <Text>Attention ! Cette suppression sera définitive.</Text>
            <ButtonGroup isInlineFrom="md">
              <Button secondary onClick={handleDelete} color="error" icon="ri-delete-bin-2-line">
                Supprimer
              </Button>
            </ButtonGroup>
          </>
        )}
      </Container>
    </form>
  );
}
NomenclatureForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
NomenclatureForm.defaultProps = {
  id: null,
  data: { usualName: null, otherNames: [] },
};

export default function NomenclaturesPage({ route, title }) {
  const { data, isLoading, error, reload } = useFetch(route);
  const [isOpen, setIsOpen] = useState();
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const handleDelete = async (id) => {
    if (!id) return;
    const response = await api.delete(`${route}/${id}`);
    if (response.ok) {
      reload();
      setIsOpen(false);
    }
  };
  const handleSave = async (id, body) => {
    const method = id ? 'patch' : 'post';
    const url = id ? `${route}/${id}` : route;
    const response = await api[method](url, body);
    if (response.ok) {
      reload();
      setIsOpen(false);
    }
  };

  const handleModalToggle = (item = {}) => {
    const { id, ...rest } = item;
    setModalTitle(item?.id ? 'Modifier' : 'Ajouter');
    setModalContent(
      <NomenclatureForm
        id={id}
        data={rest}
        onDelete={handleDelete}
        onSave={handleSave}
      />,
    );
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
            <BreadcrumbItem>{title}</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="fr-row--space-between flex--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">{title}</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button secondary size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Ajouter</Button>
      </Row>
      <hr />
      {data.data?.map((item) => (
        <>
          <Row className="fr-row--space-between">
            <div className="flex--grow fr-pl-2w">
              <Text spacing="my-1v" bold size="lg">{item.usualName}</Text>
              <Text as="span" bold>Autres noms: </Text>
              {item.otherNames.length ? item.otherNames.map((name) => <Tag as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
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
            </div>
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

NomenclaturesPage.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
