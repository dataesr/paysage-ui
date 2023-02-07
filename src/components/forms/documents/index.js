import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, CheckboxGroup, Col, Container, File, Icon, Radio, RadioGroup, Row, Select, Tag, TagGroup, Text, TextInput, Title } from '@dataesr/react-dsfr';
import useNotice from '../../../hooks/useNotice';
import useForm from '../../../hooks/useForm';
import useFetch from '../../../hooks/useFetch';
import api from '../../../utils/api';
import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import SearchBar from '../../search-bar';
import PaysageBlame from '../../paysage-blame';
import useAuth from '../../../hooks/useAuth';
import { Spinner } from '../../spinner';
import isValidUrl from '../../../utils/url-validation';

function validate(body) {
  const validationErrors = {};
  if (!body.title) { validationErrors.title = 'Le nom du document est obligatoire.'; }
  if (!body.startDate) { validationErrors.startDate = 'Une date est obligatoire.'; }
  if (!body.documentTypeId) { validationErrors.type = 'Le type est obligatoire.'; }
  if (!body.files?.length) { validationErrors.files = 'Un fichier est obligatoire.'; }
  if (!body.isPublic && !body.canAccess.length) { validationErrors.canAccess = 'Sélectionnez au moins 1 groupe.'; }
  if (body.documentUrl && isValidUrl(body.documentUrl) === false) { validationErrors.documentUrl = "L'URL est invalide."; }
  return validationErrors;
}

function sanitize(form) {
  const fields = ['title', 'canAccess', 'description', 'documentUrl', 'documentTypeId', 'files', 'startDate', 'endDate', 'relatesTo', 'canAccess', 'isPublic'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  if (body.isPublic === true) { body.canAccess = []; }
  return body;
}

export default function DocumentsForm({ id, data, onSave, onDelete }) {
  const { viewer } = useAuth();
  const { data: documentTypes } = useFetch('/document-types?limit=500');

  const { form, updateForm, errors } = useForm({ files: [], canAccess: [], documentTypeId: '', isPublic: true, ...data }, validate);
  const { notice } = useNotice();
  const [showErrors, setShowErrors] = useState(false);
  const [filesErrors, setFilesErrors] = useState(false);
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    const relatesTo = form.relatedObjects?.length ? form.relatedObjects.map((element) => element.id) : [];
    if (form.currentObjectId) relatesTo.push(form.currentObjectId);
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize({ ...form, relatesTo });
    return onSave(body, id);
  };

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

  const handleObjectFile = (url) => {
    updateForm({ files: [...form.files.filter((file) => file.url !== url)] });
  };

  const handleGroupSelect = (groupId) => {
    if (form.canAccess.includes(groupId)) {
      updateForm({ canAccess: [...form.canAccess.filter((group) => group !== groupId)] });
    } else {
      updateForm({ canAccess: [...form.canAccess, groupId] });
    }
  };

  useEffect(() => {
    const getAutocompleteResult = async () => {
      setIsSearching(true);
      const response = await api.get(`/autocomplete?query=${query}`);
      setOptions(response.data?.data);
      setIsSearching(false);
    };
    if (query) { getAutocompleteResult(); } else { setOptions([]); }
  }, [query]);

  useEffect(() => {
    const saveFiles = async () => {
      const formData = new FormData();
      for (let i = 0; i < files.length; i += 1) {
        formData.append(`files[${i}]`, files[i]);
      }
      formData.append('files', files);
      api.post('/files', formData, { 'Content-Type': 'multipart/form-data' })
        .then((response) => {
          updateForm({ files: [...form.files, ...response.data.data] });
          setFilesErrors(false);
          setFiles([]);
          setIsLoading(false);
        })
        .catch(() => { setFilesErrors(true); setFiles([]); });
    };
    if (files && files.length) saveFiles();
  }, [updateForm, files, notice, form]);

  const documentTypesOptions = (documentTypes?.data) ? [
    { label: 'Sélectionner un type', value: '' }, ...documentTypes.data.map((element) => ({ label: element.usualName, value: element.id })),
  ] : [{ label: 'Sélectionner un type', value: '' }];

  return (
    <form>
      <PaysageBlame
        createdBy={data.createdBy}
        updatedBy={data.updatedBy}
        updatedAt={data.updatedAt}
        createdAt={data.createdAt}
      />
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <Select
              label="Type"
              options={documentTypesOptions}
              selected={form.documentTypeId}
              onChange={(e) => updateForm({ documentTypeId: e.target.value })}
              required
              message={(showErrors && errors.documentTypeId) ? errors.documentTypeId : null}
              messageType={(showErrors && errors.documentTypeId) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Nom"
              required
              value={form.title || ''}
              onChange={(e) => updateForm({ title: e.target.value })}
              message={(showErrors && errors.title) ? errors.title : null}
              messageType={(showErrors && errors.title) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Description"
              message={(showErrors && errors.description) ? errors.description : null}
              messageType={(showErrors && errors.description) ? 'error' : ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              textarea
              value={form.description || ''}
            />
            <TextInput
              label="Lien vers le document"
              hint="Saisissez une url valide, commençant par https://"
              type="URL"
              message={(showErrors && errors.documentUrl) ? errors.documentUrl : null}
              messageType={(showErrors && errors.documentUrl) ? 'error' : ''}
              onChange={(e) => updateForm({ documentUrl: e.target.value })}
              value={form.documentUrl || ''}
            />
          </Col>
          <Col n="12">
            <DateInput
              required
              value={form.startDate || ''}
              label="Date de début de validité"
              hint="Une date approximée à l'année permet de sélectionner une plage de temps. (e.g. Bilan social -> 2022)"
              onDateChange={((v) => updateForm({ startDate: v }))}
              message={(showErrors && errors.startDate) ? errors.startDate : null}
              messageType={(showErrors && errors.startDate) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.endDate || ''}
              label="Date de fin de validité"
              onDateChange={((v) => updateForm({ endDate: v }))}
            />
          </Col>
          <Col n="12">
            <File
              required
              label="Ajouter des fichiers"
              hint="Formats acceptés csv, doc, docx, jpg, pdf, png, xls, xlsx"
              onChange={(e) => { setIsLoading(true); setFiles(e.target.files); }}
              multiple
              errorMessage={(showErrors && errors.files) ? errors.files : null}
            />
            {(filesErrors) ? <Text size="xs" className="fr-error-text">Une erreur est survenue à l'ajout des fichiers. Veuillez réessayer</Text> : null}
            {(!isLoading) ? (
              form.files?.length > 0
              && (
                <Row spacing="mt-2w">
                  <TagGroup>
                    {form.files.map((file) => (
                      <Tag key={file.url} onClick={() => handleObjectFile(file.url)}>
                        {file.originalName}
                        <Icon iconPosition="right" name="ri-close-line" />
                      </Tag>
                    ))}
                  </TagGroup>
                </Row>
              )
            ) : <Spinner />}
          </Col>
          <Col n="12">
            <SearchBar
              buttonLabel="Rechercher"
              isSearching={isSearching}
              label="Lier d'autres objets Paysage à cet évènement"
              onChange={(e) => { setQuery(e.target.value); }}
              onSelect={handleObjectSelect}
              options={options}
              placeholder="Rechercher..."
              value={query || ''}
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
          <Col n="12"><Title spacing="mb-0" as="h3" look="h5">Paramètres d'accès</Title></Col>
          <Col n="12">
            <RadioGroup required legend="Qui peut accéder au document" isInline>
              <Radio
                label="Accessible à tous"
                value
                checked={form?.isPublic}
                onChange={() => updateForm({ isPublic: true })}
              />
              <Radio
                checked={!form?.isPublic}
                label="Restreindre l'accès"
                required
                onChange={() => updateForm({ isPublic: false })}
                value={false}
              />
              {(!form.isPublic && viewer?.groups?.length > 0) ? (
                <CheckboxGroup
                  required
                  isInline
                  legend="Sélectionner les groupes qui pourront accéder à la ressource"
                  message={(!form.canAccess.length) ? errors.canAccess : null}
                  messageType={(showErrors && errors.canAccess) ? 'error' : ''}
                >
                  {viewer.groups.map((group) => (
                    <Checkbox
                      checked={form.canAccess?.includes(group.id)}
                      onClick={() => handleGroupSelect(group.id)}
                      label={group.acronym || group.name}
                    />
                  ))}
                </CheckboxGroup>
              ) : null }
            </RadioGroup>
          </Col>
        </Row>
        <FormFooter
          id={id || null}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}
DocumentsForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
DocumentsForm.defaultProps = {
  id: null,
  data: { relatedObjects: [], files: [] },
};
