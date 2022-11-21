import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import PaysageBlame from '../../paysage-blame';
import useForm from '../../../hooks/useForm';
import FormFooter from '../form-footer';
import SearchBar from '../../search-bar';
import TagInput from '../../tag-input';

function validate(body) {
  const validationErrors = {};
  if (!body.usualNameFr) { validationErrors.usualNameFr = 'Le nom usuel est obligatoire.'; }
  const priority = parseInt(body.priority, 10);
  if (priority > 99 || priority < 1) { validationErrors.for = 'Doit être compris en 1 (priorité forte) et 99 (priorité faible)'; }
  return validationErrors;
}

function sanitize(form) {
  const fields = [
    'usualNameFr',
    'usualNameEn',
    'shortNameEn',
    'shortNameFr',
    'acronymFr',
    'pluralNameFr',
    'otherNamesFr',
    'otherNamesEn',
    'descriptionFr',
    'descriptionEn',
    'priority',
    'comment',
    'creationOfficialTextId',
    'closureOfficialTextId',
  ];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  body.priority = parseInt(body.priority, 10);
  return body;
}

export default function CategoryTermsForm({ id, data, onSave, onDelete }) {
  const [showErrors, setShowErrors] = useState(false);
  const [startDateOfficialTextQuery, setStartDateOfficialTextQuery] = useState('');
  const [endDateOfficialTextQuery, setEndDateOfficialTextQuery] = useState('');

  const [startDateOfficialTextOptions, setStartDateOfficialTextOptions] = useState([]);
  const [endDateOfficialTextOptions, setEndDateOfficialTextOptions] = useState([]);
  const [isSearchingStartDateOfficialText, setIsSearchingStartDateOfficialText] = useState(false);
  const [isSearchingEndDateOfficialText, setIsSearchingEndDateOfficialText] = useState(false);

  const { form, updateForm, errors } = useForm({ priority: 99, ...data }, validate);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingStartDateOfficialText(true);
      const response = await api.get(`/autocomplete?query=${startDateOfficialTextQuery}&types=official-texts`);
      setStartDateOfficialTextOptions(response.data?.data);
      setIsSearchingStartDateOfficialText(false);
    };
    if (startDateOfficialTextQuery) { getAutocompleteResult(); } else { setStartDateOfficialTextOptions([]); }
  }, [startDateOfficialTextQuery]);

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearchingEndDateOfficialText(true);
      const response = await api.get(`/autocomplete?query=${endDateOfficialTextQuery}&types=official-texts`);
      setEndDateOfficialTextOptions(response.data?.data);
      setIsSearchingEndDateOfficialText(false);
    };
    if (endDateOfficialTextQuery) { getAutocompleteResult(); } else { setEndDateOfficialTextOptions([]); }
  }, [endDateOfficialTextQuery]);

  const handleEndDateOfficialTextSelect = ({ id: endDateOfficialTextId, name }) => {
    updateForm({ endDateOfficialTextName: name, endDateOfficialTextId });
    setEndDateOfficialTextQuery('');
    setEndDateOfficialTextOptions([]);
  };
  const handleEndDateOfficialTextOptionsUnselect = () => {
    updateForm({ endDateOfficialTextName: null, endDateOfficialTextId: null });
    setEndDateOfficialTextQuery('');
    setEndDateOfficialTextOptions([]);
  };

  const handleStartDateOfficialTextSelect = ({ id: startDateOfficialTextId, name }) => {
    updateForm({ startDateOfficialTextName: name, startDateOfficialTextId });
    setStartDateOfficialTextQuery('');
    setStartDateOfficialTextOptions([]);
  };
  const handleStartDateOfficialTextOptionsUnselect = () => {
    updateForm({ startDateOfficialTextName: null, startDateOfficialTextId: null });
    setStartDateOfficialTextQuery('');
    setStartDateOfficialTextOptions([]);
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  return (
    <form>
      <Container fluid>
        <PaysageBlame
          createdBy={data.createdBy}
          updatedBy={data.updatedBy}
          updatedAt={data.updatedAt}
          createdAt={data.createdAt}
        />
        <Row gutters>
          <Col n="12"><Title as="h2" look="h5" spacing="mb-0">Dénominations en français</Title></Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom usuel en français"
              value={form.usualNameFr || ''}
              onChange={(e) => updateForm({ usualNameFr: e.target.value })}
              required
              message={(showErrors && errors.usualNameFr) ? errors.usualNameFr : null}
              messageType={(showErrors && errors.usualNameFr) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom court en français"
              value={form.shortNameFr || ''}
              onChange={(e) => updateForm({ shortNameFr: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom pluriel français"
              value={form.pluralNameFr || ''}
              onChange={(e) => updateForm({ pluralNameFr: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Acronyme français"
              value={form.acronymFr || ''}
              onChange={(e) => updateForm({ acronymFr: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TagInput
              label="Autres noms français"
              hint='Valider votre ajout avec la touche "Entrée"'
              tags={form.otherNamesFr || []}
              onTagsChange={(tags) => updateForm({ otherNamesFr: tags })}
            />
          </Col>
          <Col n="12"><Title as="h2" look="h5" spacing="mb-0">Dénominations en anglais</Title></Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom usuel en anglais"
              value={form.usualNameEn || ''}
              onChange={(e) => updateForm({ usualNameEn: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Nom court en anglais"
              value={form.shortNameEn || ''}
              onChange={(e) => updateForm({ shortNameEn: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TagInput
              label="Autres noms anglais"
              hint='Valider votre ajout avec la touche "Entrée"'
              tags={form.otherNamesEn || []}
              onTagsChange={(tags) => updateForm({ otherNamesEn: tags })}
            />
          </Col>
          <Col n="12"><Title as="h2" look="h5" spacing="mb-0">Descriptions</Title></Col>
          <Col n="12 md-6">
            <TextInput
              label="Description en français"
              value={form.descriptionFr || ''}
              onChange={(e) => updateForm({ descriptionFr: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Description en anglais"
              value={form.descriptionEn || ''}
              onChange={(e) => updateForm({ descriptionEn: e.target.value })}
            />
          </Col>
          <Col n="12"><Title as="h2" look="h5" spacing="mb-0">Priorité</Title></Col>
          <Col n="12 md-6">
            <TextInput
              type="number"
              label="Priorité"
              value={form.priority || ''}
              onChange={(e) => updateForm({ priority: e.target.value })}
              message={(showErrors && errors.priority) ? errors.priority : null}
              messageType={(showErrors && errors.priority) ? 'error' : ''}
            />
          </Col>
          <Col n="12"><Title as="h2" look="h5" spacing="mb-0">Textes officiels</Title></Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              value={startDateOfficialTextQuery || ''}
              label="Texte officiel de création"
              hint="Rechercher et sélectionner un texte officiel"
              scope={form.startDateOfficialTextName}
              placeholder={form.startDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ startDateOfficialTextId: null }); setStartDateOfficialTextQuery(e.target.value); }}
              options={startDateOfficialTextOptions}
              onSelect={handleStartDateOfficialTextSelect}
              onDeleteScope={handleStartDateOfficialTextOptionsUnselect}
              isSearching={isSearchingStartDateOfficialText}
            />
          </Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              value={endDateOfficialTextQuery || ''}
              label="Texte officiel de fin"
              hint="Rechercher et sélectionner un texte officiel"
              scope={form.endDateOfficialTextName}
              placeholder={form.endDateOfficialTextId ? '' : 'Rechercher...'}
              onChange={(e) => { updateForm({ endDateOfficialTextId: null }); setEndDateOfficialTextQuery(e.target.value); }}
              options={endDateOfficialTextOptions}
              onSelect={handleEndDateOfficialTextSelect}
              onDeleteScope={handleEndDateOfficialTextOptionsUnselect}
              isSearching={isSearchingEndDateOfficialText}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

CategoryTermsForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
CategoryTermsForm.defaultProps = {
  id: null,
  data: { relatedObjects: [] },
  onDelete: null,
};
