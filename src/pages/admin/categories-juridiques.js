import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Text, Title, Modal, ModalTitle, ModalContent, TextInput, Badge, Tag, Select, ButtonGroup } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';
import TagInput from '../../components/tag-input';
import { toString } from '../../utils/dates';
import useForm from '../../hooks/useForm';
import Button from '../../components/button';

function LegalCategoriesForm({ id, data, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.longNameFr) { validationErrors.longNameFr = 'Le nom long en français est obligatoire'; }
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

  const sectorOptions = [
    { value: null, label: "Selectionner un type d'objet" },
    { value: 'public', label: 'Public' },
    { value: 'privé', label: 'Privé' },
    { value: 'sans objet', label: 'Sans objet' },
  ];
  const legalPersonalityOptions = [
    { value: null, label: "Selectionner un type d'objet" },
    { value: 'personne morale de droit public', label: 'Personne morale de droit public' },
    { value: 'personne morale de droit privé', label: 'Personne morale de droit privé' },
    { value: 'organisation internationale', label: 'Organisation internationale' },
    { value: 'autre forme juridique étrangère', label: 'Autre forme juridique étrangère' },
    { value: 'sans personalité juridique', label: 'Sans personalité juridique' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput
              required
              label="Nom long en français"
              value={form.longNameFr}
              onChange={(e) => updateForm({ longNameFr: e.target.value })}
              message={(showErrors && errors.longNameFr) ? errors.usualName : null}
              messageType={(showErrors && errors.longNameFr) ? 'error' : ''}
            />
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
            <TextInput label="Code insee" value={form.inseeCode} onChange={(e) => updateForm({ inseeCode: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Identifiant Wikidata" value={form.wikidataId} onChange={(e) => updateForm({ wikidataId: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom court en anglais" value={form.shortNameEn} onChange={(e) => updateForm({ shortNameEn: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom long en anglais" value={form.longNameEn} onChange={(e) => updateForm({ longNameEn: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <Select label="Secteur" selected={form.sector} options={sectorOptions} onChange={(e) => updateForm({ sector: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <Select label="Secteur" selected={form.legalPersonality} options={legalPersonalityOptions} onChange={(e) => updateForm({ legalPersonality: e.target.value })} />
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
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
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
            <Title as="h2" look="h6">Supprimer cette catégorie juridique</Title>
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
LegalCategoriesForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
LegalCategoriesForm.defaultProps = {
  id: null,
  data: {
    inseeCode: '',
    longNameFr: '',
    shortNameFr: '',
    acronymFr: '',
    pluralNameFr: '',
    descriptionFr: '',
    longNameEn: '',
    shortNameEn: '',
    otherNames: [],
    sector: null,
    officialTextId: '',
    legalPersonality: null,
    inPublicResearch: null,
    wikidataId: '',
    websiteFr: '',
    websiteEn: '',
    comment: '',
  },
};

export default function LegalCategoriesPage() {
  const route = '/legal-categories';
  const { data, isLoading, error, reload } = useFetch(`${route}?limit=500`);
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
      <Row className="fr-row--space-between flex--baseline">
        <Row alignItems="top">
          <Title className="fr-pr-1v" as="h2" look="h3">Catégories juridiques</Title>
          <Badge type="info" text={data?.totalCount} />
        </Row>
        <Button secondary size="sm" icon="ri-add-line" onClick={() => handleModalToggle()}>Ajouter</Button>
      </Row>
      <hr />
      {data.data?.map((item) => (
        <div key={item.id}>
          <Row className="fr-row--space-between">
            <div className="flex--grow fr-pl-2w">
              <Text spacing="my-1v" bold size="lg">{item.longNameFr}</Text>
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
