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

const objectNameMapper = [
  { name: 'Personnes', object: 'persons' },
  { name: 'Structures', object: 'structures' },
  { name: 'Prix', object: 'prices' },
  { name: 'Projets', object: 'projects' },
  { name: 'Termes', object: 'terms' },
  { name: 'Catégories', object: 'categories' },
];

function RelationTypesForm({ id, initialForm, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.name) { validationErrors.name = 'Le nom est obligatoire'; }
    if (!body.for?.length) { validationErrors.for = 'Ce champs est obligatoire'; }
    const priority = parseInt(body.priority, 10);
    if (priority > 99 || priority < 1) { validationErrors.for = 'Doit être compris en 1 (priorité forte) et 99 (priorité faible)'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm(initialForm, validateForm);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    form.priority = parseInt(form.priority, 10);
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
            <TextInput type="number" step="1" min="1" max="99" label="Priorité" value={form.priority} onChange={(e) => updateForm({ priority: e.target.value })} />
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
              {objectNameMapper.map((element) => (
                <Checkbox
                  checked={form.for.filter((f) => (f === element.object)).length}
                  size="sm"
                  onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, element.object] : form.for.filter((f) => (f !== element.object))) })}
                  label={element.name}
                />
              ))}
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
  initialForm: { for: [], priority: '99' },
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
    if (!id) {
      setModalContent(<RelationTypesForm onDelete={handleDelete} onSave={handleSave} />);
    } else {
      setModalContent(
        <RelationTypesForm
          id={id}
          initialForm={rest}
          onDelete={handleDelete}
          onSave={handleSave}
        />,
      );
    }
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
      <Row className="fr-row--space-between flex--baseline">
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
                  Priorité:
                  {' '}
                  <Badge text={item.priority} />
                </Text>
              </Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Autres noms:
                  {' '}
                  {item.otherNames.length ? item.otherNames.map((name) => <Tag key={name} as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
                </Text>
              </Row>
              <Row>
                <Text as="span" bold className="fr-mb-2v">
                  Appliquable aux:
                  {' '}
                  {item.for.map((object) => <Tag key={object} as="span">{object}</Tag>)}
                </Text>
              </Row>
              <Row>
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
