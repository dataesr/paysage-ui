import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem, Col, Container, Row, Text, Title, Modal, ModalTitle, ModalContent, TextInput, Badge, Tag, Select } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';
import TagInput from '../../components/tag-input';
import { toString } from '../../utils/dates';
import useForm from '../../hooks/useForm';

function LegalCategoriesForm({ id, initialForm, onSave, onDelete }) {
  const { form, updateForm } = useForm(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(id, form);
  };

  const handleDelete = () => onDelete(id);

  const options = [
    { value: null, label: "Selectionner un type d'objet" },
    { value: 'public', label: 'Public' },
    { value: 'privé', label: 'Privé' },
    { value: 'sans objet', label: 'Sans objet' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom" value={form.usualName} onChange={(e) => updateForm({ usualName: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom long en français" value={form.longNameFr} onChange={(e) => updateForm({ longNameFr: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom court en français" value={form.shortNameFr} onChange={(e) => updateForm({ shortNameFr: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Acronyme en français" value={form.acronymFr} onChange={(e) => updateForm({ acronymFr: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom pluriel en français" value={form.pluralNameFr} onChange={(e) => updateForm({ pluralNameFr: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput textarea label="Description en français" value={form.descriptionFr} onChange={(e) => updateForm({ descriptionFr: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom court en anglais" value={form.shortNameEn} onChange={(e) => updateForm({ shortNameEn: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom long en anglais" value={form.longNameEn} onChange={(e) => updateForm({ longNameEn: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <Select label="Secteur" selected={form.sector} options={options} onChange={(e) => updateForm({ sector: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Site web en anglais" value={form.websiteEn} onChange={(e) => updateForm({ websiteEn: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Site web en français" value={form.websiteFr} onChange={(e) => updateForm({ websiteFr: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput textarea label="Commentaire" value={form.comment} onChange={(e) => updateForm({ comment: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
              tags={form.otherNames}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
        </Row>
        <Button submit iconPosition="right" icon="ri-save-line">Enregistrer</Button>
        <hr />
        {id && (
          <Button secondary onClick={handleDelete} colors={['var(--background-action-high-error)', 'white']} icon="ri-chat-delete-line">
            Supprimer
          </Button>
        )}
      </Container>
    </form>
  );
}
LegalCategoriesForm.propTypes = {
  id: PropTypes.string,
  initialForm: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
LegalCategoriesForm.defaultProps = {
  id: null,
  initialForm: {
    inseeCode: null,
    longNameFr: null,
    shortNameFr: null,
    acronymFr: null,
    pluralNameFr: null,
    descriptionFr: null,
    longNameEn: null,
    shortNameEn: null,
    otherNames: [],
    sector: null,
    officialTextId: null,
    legalPersonality: null,
    inPublicResearch: null,
    wikidataId: null,
    websiteFr: null,
    websiteEn: null,
    comment: null,
  },
};

export default function LegalCategoriesPage() {
  const route = '/legal-categories';
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
      <LegalCategoriesForm
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
            <BreadcrumbItem>Catégories juridiques</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="fr-row--space-between fr-row--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Catégories juridiques</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button secondary size="sm" icon="ri-add-line" onClick={handleModalToggle}>Ajouter</Button>
      </Row>
      <hr />
      {data.data?.map((item) => (
        <>
          <Row className="fr-row--space-between">
            <div className="fr-col--grow fr-pl-2w">
              <Text spacing="my-1v" bold size="lg">{item.longNameFr}</Text>
              <Text as="span" bold>Autres noms: </Text>
              {item.otherNames.length ? item.otherNames.map((name) => <Tag as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
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
