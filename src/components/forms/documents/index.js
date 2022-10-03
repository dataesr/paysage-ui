import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, File, Icon, Row, Select, Tag, TagGroup, Text, TextInput } from '@dataesr/react-dsfr';
import useNotice from '../../../hooks/useNotice';
import useForm from '../../../hooks/useForm';
import useFetch from '../../../hooks/useFetch';
import api from '../../../utils/api';
import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import SearchBar from '../../search-bar';

export default function DocumentsForm({ id, initialForm, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.title) { validationErrors.title = "Le titre de l'évènement est obligatoire."; }
    if (!body.startDate) { validationErrors.eventDate = 'Une date est obligatoire.'; }
    if (!body.documentTypeId) { validationErrors.type = 'Le type est obligatoire.'; }
    if (!body.files?.length) { validationErrors.files = 'Un fichier est obligatoire'; }
    return validationErrors;
  };

  const { data: documentTypes } = useFetch('/document-types?limit=500');

  const { form, updateForm, errors } = useForm({ files: [], documentTypeId: '', ...initialForm }, validateForm);
  const [showErrors, setShowErrors] = useState(false);
  const [filesErrors, setFilesErrors] = useState(false);
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const { notice } = useNotice();

  const handleSubmit = () => {
    // Get ids of the related objects to conform to api post model
    // Add _a minima_ current object id to relatesTo list
    // Remove form managment values from form
    const relatesTo = form.relatedObjects?.length ? form.relatedObjects.map((element) => element.id) : [];
    if (form.currentObjectId) relatesTo.push(form.currentObjectId);
    const { relatedObjects, currentObjectId, ...rest } = form;
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    return onSave({ ...rest, relatesTo }, id);
  };

  const handleObjectSelect = ({ id: relatedObjectId, name }) => {
    const currentRelatedObjects = form.relatedObjects?.length ? form.relatedObjects : [];
    updateForm({ relatedObjects: [...currentRelatedObjects, { id: relatedObjectId, name }] });
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

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/autocomplete?query=${query}`);
      setOptions(response.data?.data);
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
        })
        .catch(() => { setFilesErrors(true); setFiles([]); });
    };
    if (files && files.length) saveFiles();
  }, [updateForm, files, notice, form]);

  const documentTypesOptions = (documentTypes?.data) ? [
    { label: 'Séléctionnez un type', value: '' }, ...documentTypes.data.map((element) => ({ label: element.usualName, value: element.id })),
  ] : [{ label: 'Séléctionnez un type', value: '' }];

  return (
    <form>
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-2w">
            <Select
              label="Type du document"
              options={documentTypesOptions}
              selected={form.documentTypeId}
              onChange={(e) => updateForm({ documentTypeId: e.target.value })}
              required
              message={(showErrors && errors.documentTypeId) ? errors.documentTypeId : null}
              messageType={(showErrors && errors.documentTypeId) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Nom du document"
              required
              value={form.title || ''}
              onChange={(e) => updateForm({ title: e.target.value })}
              message={(showErrors && errors.title) ? errors.title : null}
              messageType={(showErrors && errors.title) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Description du document"
              value={form.description || ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              message={(showErrors && errors.description) ? errors.description : null}
              messageType={(showErrors && errors.description) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <DateInput
              required
              value={form.startDate || ''}
              label="Date de début de validité du document"
              hint="Une date approximée à l'année permet de séléctionner une plage de temps. (e.g. Bilan social -> 2022)"
              onDateChange={((v) => updateForm({ startDate: v }))}
              message={(showErrors && errors.startDate) ? errors.startDate : null}
              messageType={(showErrors && errors.startDate) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <DateInput
              required
              value={form.endDate || ''}
              label="Date de fin de validité du document"
              onDateChange={((v) => updateForm({ endDate: v }))}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <File
              required
              label="Ajouter des fichiers"
              hint="Format acceptés csv, jpg, png, pdf, doc, docx, xls, xlsx, csv"
              onChange={(e) => setFiles(e.target.files)}
              multiple
              message={(filesErrors) ? "Une erreur est survenue à l'ajout des fichiers" : null}
              messageType={(filesErrors) ? 'error' : ''}
            />
            {(filesErrors) ? <Text size="xs" className="fr-error-text">Une erreur est survenue à l'ajout des fichiers. Veuillez réessayer</Text> : null}
            {(form.files?.length > 0) && (
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
            )}
          </Col>
          <Col n="12" spacing="pb-2w">
            <SearchBar
              buttonLabel="Rechercher"
              value={query || ''}
              label="Lier d'autres objets paysage à cet évènement"
              placeholder="Rechercher..."
              onChange={(e) => { setQuery(e.target.value); }}
              options={options}
              onSelect={handleObjectSelect}
            />
            {(form.relatedObjects?.length > 0) && (
              <Row spacing="mt-2w">
                <TagGroup>
                  {form.relatedObjects.map((element) => (
                    <Tag key={element.id} onClick={() => handleObjectDelete(element.id)}>
                      {element.name}
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
    </form>
  );
}
DocumentsForm.propTypes = {
  id: PropTypes.string,
  initialForm: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
DocumentsForm.defaultProps = {
  id: null,
  initialForm: { relatedObjects: [], files: [] },
};
