import PropTypes from 'prop-types';
import {
  Col,
  Container,
  Icon,
  Row,
  Select,
  Tag,
  TagGroup,
  TextInput,
  Title,
} from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import DateInput from '../../date-input';
import api from '../../../utils/api';
import useForm from '../../../hooks/useForm';
import FormFooter from '../form-footer';
import SearchBar from '../../search-bar';
import PaysageBlame from '../../paysage-blame';

function validator(body) {
  const ret = {};
  if (!body.nature) ret.nature = 'La nature du texte officiel est obligatoire';
  if (!body.type) ret.type = 'Le type du texte officiel est obligatoire';
  if (!body.title) ret.title = 'Le titre du texte officiel est obligatoire';
  if (!body.pageUrl) ret.pageUrl = "L'URL de destination du texte officiel est obligatoire";
  if (!body.publicationDate) ret.publicationDate = 'La date de publication du texte officiel est obligatoire';
  return ret;
}
function sanitize(form) {
  const fields = ['nature', 'type', 'jorftext', 'nor', 'title', 'pageUrl', 'boesrId', 'joId', 'publicationDate',
    'signatureDate', 'startDate', 'previsionalEndDate', 'endDate', 'textExtract', 'comment', 'relatesTo'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function OfficiaTextForm({ id, data, onSave, onDelete }) {
  const [showErrors, setShowErrors] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { form, updateForm, errors } = useForm(data, validator);

  const handleSubmit = () => {
    const relatesTo = form.relatedObjects?.length ? form.relatedObjects.map((element) => element.id) : [];
    if (form.currentObjectId) relatesTo.push(form.currentObjectId);
    const { relatedObjects, currentObjectId, ...rest } = form;
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize({ ...rest, relatesTo });
    return onSave(body, id);
  };

  useEffect(() => {
    if (!showErrors) return;
    const field = Object.keys(errors)?.[0];
    if (field) {
      const element = document.getElementsByName(field);
      if (element?.length) element[0].scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  }, [showErrors, errors]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearching(true);
      const response = await api.get(`/search?query=${query}`);
      setOptions(response.data?.data);
      setIsSearching(false);
    };
    if (query) { getAutocompleteResult(); } else { setOptions([]); }
  }, [query]);

  const natureOptions = [
    { value: '', label: 'Sélectionner' },
    { value: 'Publication au JO', label: 'Publication au JO' },
    { value: 'Publication au BOESR', label: 'Publication au BOESR' },
  ];

  const typeOptions = [
    { value: '', label: 'Sélectionner' },
    { value: 'Loi', label: 'Loi' },
    { value: 'Décret', label: 'Décret' },
    { value: 'Ordonnance', label: 'Ordonnance' },
    { value: "Avis de vacance d'emploi", label: "Avis de vacance d'emploi" },
    { value: 'Arrêté', label: 'Arrêté' },
    { value: 'Circulaire', label: 'Circulaire' },
  ];

  const handleObjectSelect = ({ id: relatedObjectId, name: displayName }) => {
    const currentRelatedObjects = form.relatedObjects?.length ? form.relatedObjects : [];
    updateForm({ relatedObjects: [...currentRelatedObjects, { id: relatedObjectId, displayName }] });
    setQuery('');
    setOptions([]);
  };

  const handleObjectDelete = (objectId) => {
    updateForm({ relatedObjects: form.relatedObjects.filter((o) => o.id !== objectId) });
    setQuery('');
    setOptions([]);
  };

  return (
    <Container fluid className="fr-pb-6w">
      <PaysageBlame
        createdBy={data.createdBy}
        updatedBy={data.updatedBy}
        updatedAt={data.updatedAt}
        createdAt={data.createdAt}
      />
      <Row gutters className="flex--last-baseline">
        <Col n="12 md-6">
          <Select
            label="Nature"
            options={natureOptions}
            name="nature"
            selected={form.nature}
            onChange={(e) => updateForm({ nature: e.target.value })}
            required
            message={(showErrors && errors.nature) ? errors.nature : null}
            messageType={(showErrors && errors.nature) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6">
          <Select
            label="Type"
            options={typeOptions}
            selected={form.type}
            name="type"
            onChange={(e) => updateForm({ type: e.target.value })}
            required
            message={(showErrors && errors.type) ? errors.type : null}
            messageType={(showErrors && errors.type) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6">
          <TextInput
            label="Numéro jorftext pour les publications au JO"
            hint="Uniquement si Publication au JO"
            name="jorftext"
            value={form.jorftext}
            onChange={(e) => updateForm({ jorftext: e.target.value })}
          />
        </Col>
        <Col n="12 md-6">
          <TextInput
            label="Numéro NOR du texte officiel"
            hint="(système normalisé de numérotation des textes officiels publiés en France)"
            value={form.nor}
            onChange={(e) => updateForm({ nor: e.target.value })}
          />
        </Col>
        <Col n="12">
          <TextInput
            label="Titre du texte officiel"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            required
            name="title"
            message={(showErrors && errors.title) ? errors.title : null}
            messageType={(showErrors && errors.title) ? 'error' : ''}
          />
        </Col>
        <Col n="12">
          <TextInput
            label="URL"
            value={form.pageUrl}
            onChange={(e) => updateForm({ pageUrl: e.target.value })}
            required
            name="pageUrl"
            message={(showErrors && errors.pageUrl) ? errors.pageUrl : null}
            messageType={(showErrors && errors.pageUrl) ? 'error' : ''}
          />
        </Col>
        <Col n="12 md-6">
          <TextInput
            label="Numéro du BOESR où a été publié le texte"
            value={form.boesrId}
            onChange={(e) => updateForm({ boesrId: e.target.value })}
          />
        </Col>
        <Col n="12 md-6">
          <TextInput
            label="Numéro du décret ou de l’arrêté"
            value={form.joId}
            onChange={(e) => updateForm({ joId: e.target.value })}
          />
        </Col>
        <Col n="12">
          <TextInput
            textarea
            label="Résumé"
            value={form.textExtract}
            onChange={(e) => updateForm({ textExtract: e.target.value })}
          />
          <TextInput
            textarea
            label="Commentaires"
            value={form.comment}
            onChange={(e) => updateForm({ comment: e.target.value })}
          />
        </Col>
        <Col n="12"><Title spacing="mb-0" as="h3" look="h5">Dates</Title></Col>
        <Col n="12">
          <DateInput
            value={form.publicationDate}
            label="Date de publication"
            onDateChange={(v) => updateForm({ publicationDate: v })}
            required
            name="publicationDate"
            message={(showErrors && errors.publicationDate) ? errors.publicationDate : null}
            messageType={(showErrors && errors.publicationDate) ? 'error' : ''}
          />
        </Col>
        <Col n="12">
          <DateInput
            value={form.signatureDate}
            label="Date de signature"
            onDateChange={(v) => updateForm({ signatureDate: v })}
          />
        </Col>
        <Col n="12">
          <DateInput
            value={form.startDate}
            label="Date de début"
            onDateChange={(v) => updateForm({ startDate: v })}
          />
        </Col>
        <Col n="12">
          <DateInput
            value={form.endDate}
            label="Date de fin"
            onDateChange={(v) => updateForm({ endDate: v })}
          />
        </Col>
        <Col n="12">
          <DateInput
            value={form.previsionalEndDate}
            label="Date de fin prévisionnelle"
            onDateChange={(v) => updateForm({ previsionalEndDate: v })}
          />
        </Col>
        <Col n="12"><Title spacing="mb-0" as="h3" look="h5">Eléments liés</Title></Col>
        <Col n="12">
          <SearchBar
            buttonLabel="Rechercher"
            value={query || ''}
            label="Lier d'autres objets Paysage à ce texte officiel"
            placeholder="Rechercher..."
            onChange={(e) => { setQuery(e.target.value); }}
            options={options}
            onSelect={handleObjectSelect}
            isSearching={isSearching}
          />
          {(form.relatedObjects?.length > 0) && (
            <Row spacing="mt-2w">
              <TagGroup>
                {form.relatedObjects.map((element) => (
                  <Tag key={element.id} onClick={() => handleObjectDelete(element.id)}>
                    {element.displayName}
                    <Icon iconPosition="right" name="ri-close-line" />
                  </Tag>
                ))}
              </TagGroup>
            </Row>
          )}
        </Col>
      </Row>
      <FormFooter
        id={id || null}
        onSaveHandler={handleSubmit}
        onDeleteHandler={onDelete}
      />
    </Container>
  );
}

OfficiaTextForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
OfficiaTextForm.defaultProps = {
  id: null,
  data: { relatedObjects: [] },
  onDelete: null,
};
