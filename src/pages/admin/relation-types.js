import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Breadcrumb, BreadcrumbItem, Checkbox, CheckboxGroup, Col, Container, Row, Text,
  Title, Modal, ModalTitle, ModalContent, TextInput, Badge, Tag, ButtonGroup,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';
import TagInput from '../../components/tag-input';
import { toString } from '../../utils/dates';
import useForm from '../../hooks/useForm';
import Button from '../../components/button';

function RelationTypesForm({ id, initialForm, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.name) { validationErrors.name = 'Le nom est obligatoire'; }
    if (!body.for?.length) { validationErrors.for = 'Ce champs est obligatoire'; }
    if (body.priority > 99 || body.priority < 1) { validationErrors.for = 'Doit être compris en 1 (priorité forte) et 99 (priorité faible)'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm({ for: [] }, validateForm);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    return onSave(id, form);
  };

  const handleDelete = () => onDelete(id);

  return (
    <form onSubmit={handleSubmit}>
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput
              required
              label="Nom"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              message={(showErrors && errors.name) ? errors.name : null}
              messageType={(showErrors && errors.name) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom pluriel" value={form.pluralName} onChange={(e) => updateForm({ pluralName: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom au féminin" value={form.feminineName} onChange={(e) => updateForm({ feminineName: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput type="number" label="Priorité" value={form.priority} onChange={(e) => updateForm({ priority: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <CheckboxGroup
              isInline
              legend="Pour: "
              message={(showErrors && errors.for) ? errors.for : null}
              messageType={(showErrors && errors.for) ? 'error' : ''}
            >
              <Checkbox
                size="sm"
                onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, 'persons'] : form.for.filter((f) => (f !== 'persons'))) })}
                label="Personnes"
              />
              <Checkbox
                size="sm"
                onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, 'structures'] : form.for.filter((f) => (f !== 'structures'))) })}
                label="Structures"
              />
              <Checkbox
                size="sm"
                onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, 'terms'] : form.for.filter((f) => (f !== 'terms'))) })}
                label="Termes"
              />
              <Checkbox
                size="sm"
                onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, 'projects'] : form.for.filter((f) => (f !== 'projects'))) })}
                label="Projets"
              />
              <Checkbox
                size="sm"
                onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, 'categories'] : form.for.filter((f) => (f !== 'categories'))) })}
                label="Catégories"
              />
              <Checkbox
                size="sm"
                onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, 'prices'] : form.for.filter((f) => (f !== 'prices'))) })}
                label="Prix"
              />
            </CheckboxGroup>
          </Col>
          <Col n="12">
            <ButtonGroup isInlineFrom="md" align="right">
              <Button submit icon="ri-save-line">Enregistrer</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <hr />
        {id && (
          <>
            <Title as="h2" look="h6">Supprimer ce type de relation</Title>
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
RelationTypesForm.propTypes = {
  id: PropTypes.string,
  initialForm: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
RelationTypesForm.defaultProps = {
  id: null,
  initialForm: { for: [] },
};

export default function RelationTypesPage() {
  const route = '/relation-types';
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
      <RelationTypesForm
        id={id}
        initialForm={rest}
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
            <BreadcrumbItem>Types de relation</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="fr-row--space-between flex--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Types de relations</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button secondary size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Ajouter</Button>
      </Row>
      <hr />
      {data.data?.map((item) => (
        <div key={item.id}>
          <Row className="fr-row--space-between">
            <div className="flex--grow fr-pl-2w">
              <Text spacing="my-1v" bold size="lg">{item.name}</Text>
              <Text as="span" bold>Autres noms: </Text>
              <Text as="span" bold>
                Priorité:
                {' '}
                {item.priority}
              </Text>
              {item.otherNames.length ? item.otherNames.map((name) => <Tag as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
              <Text as="span" bold>S'applique à: </Text>
              {item.for.map((object) => <Tag as="span">{object}</Tag>)}
              <Text spacing="mt-2w mb-0" size="xs">
                Crée le
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
              <Button size="sm" secondary icon="ri-edit-line" onClick={() => handleModalToggle(item)}>Editer</Button>
            </div>
          </Row>
          <hr />
        </div>
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
