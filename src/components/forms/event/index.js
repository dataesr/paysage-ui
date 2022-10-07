import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Container, File, Icon, Radio, RadioGroup, Row, Tag, TagGroup, Text, TextInput } from '@dataesr/react-dsfr';
import useNotice from '../../../hooks/useNotice';
import useForm from '../../../hooks/useForm';
import api from '../../../utils/api';
import DateInput from '../../date-input';
import FormFooter from '../form-footer';
import SearchBar from '../../search-bar';

export default function EventForm({ id, initialForm, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.title) { validationErrors.title = "Le titre de l'évènement est obligatoire"; }
    if (!body.eventDate) { validationErrors.eventDate = "La date de l'évènement est obligatoire"; }
    if (!body.type) { validationErrors.type = "Le type de l'évènement est obligatoire"; }
    return validationErrors;
  };

  const { form, updateForm, errors } = useForm({ files: [], ...initialForm }, validateForm);
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

  return (
    <form>
      <Container fluid>
        {/* <Row spacing="mb-2w">
          <Col n="12">
            <Alert
              title="Avez-vous vérifié que l'évènement n'existe pas ?"
              description="Utilisez la barre de recherche principale pour vérifier que l'évènement n'existe pas encore."
            />
          </Col>
        </Row> */}
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
              value={form.description || ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              message={(showErrors && errors.description) ? errors.description : null}
              messageType={(showErrors && errors.description) ? 'error' : ''}
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
  initialForm: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
EventForm.defaultProps = {
  id: null,
  initialForm: { type: 'suivi', relatedObjects: [], files: [] },
};
