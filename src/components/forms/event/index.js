import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, File, Icon, Radio, RadioGroup, Row, Tag, TagGroup, Text, TextInput } from '@dataesr/react-dsfr';
import useNotice from '../../../hooks/useNotice';
import useForm from '../../../hooks/useForm';
import api from '../../../utils/api';
import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import SearchBar from '../../search-bar';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const validationErrors = {};
  if (!body.title) { validationErrors.title = "Le titre de l'évènement est obligatoire"; }
  if (!body.eventDate) { validationErrors.eventDate = "La date de l'évènement est obligatoire"; }
  if (!body.type) { validationErrors.type = "Le type de l'évènement est obligatoire"; }
  return validationErrors;
}

function sanitize(form) {
  const fields = ['title', 'description', 'type', 'files', 'eventDate', 'relatesTo'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function EventForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm({ files: [], ...data }, validate);
  const [showErrors, setShowErrors] = useState(false);
  const [filesErrors, setFilesErrors] = useState(false);
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [options, setOptions] = useState([]);
  const { notice } = useNotice();

  const handleSubmit = () => {
    // Get ids of the related objects to conform to api post model
    // Add _a minima_ current object id to relatesTo list
    // Remove form managment values from form
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
        })
        .catch(() => { setFilesErrors(true); setFiles([]); });
    };
    if (files && files.length) saveFiles();
  }, [updateForm, files, notice, form]);

  return (
    <form>
      <PaysageBlame
        createdBy={data.createdBy}
        updatedBy={data.updatedBy}
        updatedAt={data.updatedAt}
        createdAt={data.createdAt}
      />
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-2w">
            <RadioGroup
              isInline
              legend="Type d'évènement"
              required
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
            >
              <Radio
                label="Suivi"
                value="suivi"
                checked={form?.type === 'suivi'}
                onChange={(e) => updateForm({ type: e.target.value })}
              />
              <Radio
                label="Evenement"
                value="évènement"
                checked={form?.type === 'évènement'}
                onChange={(e) => updateForm({ type: e.target.value })}
              />
            </RadioGroup>
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Titre de l'évenement"
              required
              value={form.title || ''}
              onChange={(e) => updateForm({ title: e.target.value })}
              message={(showErrors && errors.title) ? errors.title : null}
              messageType={(showErrors && errors.title) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Description de l'évènement"
              message={(showErrors && errors.description) ? errors.description : null}
              messageType={(showErrors && errors.description) ? 'error' : ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              textarea
              value={form.description || ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <DateInput
              required
              value={form.eventDate || ''}
              label="Date de l'évènement"
              onDateChange={((v) => updateForm({ eventDate: v }))}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <File
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
EventForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
EventForm.defaultProps = {
  id: null,
  data: { type: 'suivi', relatedObjects: [], files: [] },
};
