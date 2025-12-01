import {
  Alert,
  Col,
  Container,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import PaysageBlame from '../../paysage-blame';
import TagInput from '../../tag-input';
import FormFooter from '../form-footer';
import api from '../../../utils/api';
import { capitalize } from '../../../utils/strings';

function validate(body) {
  const validationErrors = {};
  if (!body.firstName) { validationErrors.firstName = 'Le prénom est obligatoire.'; }
  if (!body.lastName) { validationErrors.lastName = 'Le nom est obligatoire.'; }
  if (!body.gender) { validationErrors.gender = 'Le genre est obligatoire.'; }
  return validationErrors;
}

function sanitize(form) {
  const fields = ['gender', 'firstName', 'lastName', 'otherNames', 'birthDate', 'deathDate', 'activity'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}
export default function PersonForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm(data, validate);
  const [showErrors, setShowErrors] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkDuplicate = async () => {
      setDuplicate(null);
      if (id) return;
      const firstName = form.firstName?.trim();
      const lastName = form.lastName?.trim();
      if (!firstName || !lastName) return;
      const fullName = `${firstName} ${lastName}`;
      try {
        setChecking(true);
        const { data: res } = await api.get(`/autocomplete?types=persons&query=${encodeURIComponent(fullName)}`);
        const found = res?.data.find((el) => {
          const norm = (s) => (s || '').replace('\t', '').trim().toLowerCase();
          return norm(el.name) === norm(fullName);
        });
        if (found) setDuplicate(found.id);
      } catch (err) {
        // ignore
      } finally {
        setChecking(false);
      }
    };
    checkDuplicate();
  }, [form.firstName, form.lastName, id]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (Object.keys(errors).length !== 0) {
      setShowErrors(true);
      return null;
    }
    const body = sanitize(form);
    return onSave(body);
  };

  const genderOptions = [
    { value: '', label: 'Sélectionner' },
    { value: 'Homme', label: 'Homme' },
    { value: 'Femme', label: 'Femme' },
    { value: 'Autre', label: 'Autre' },
  ];
  return (
    <form onSubmit={handleSubmit}>
      {!id && duplicate && (
        <Alert
          type="info"
          small
          description={
            (
              <span>
                Le nom
                {' '}
                {capitalize(form.firstName?.trim())}
                {' '}
                {capitalize(form.lastName?.trim())}
                {' '}
                existe déjà dans la base de donnée.
                {' '}
                <a target="blank" href={`/personnes/${duplicate}`}>Voir la fiche</a>
                <br />
                S'il s'agit d'un homonyme, vous pouvez continuer la création.
              </span>
            )
          }
        />
      )}
      <PaysageBlame
        createdBy={data.createdBy}
        updatedBy={data.updatedBy}
        updatedAt={data.updatedAt}
        createdAt={data.createdAt}
      />
      <Container fluid className="fr-pb-6w">
        <Row gutters>
          <Col n="12 md-6">
            <TextInput
              required
              label="Prénom"
              value={form.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
              message={(showErrors && errors.firstName) ? errors.firstName : null}
              messageType={(showErrors && errors.firstName) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              required
              label="Nom"
              value={form.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
              message={(showErrors && errors.lastName) ? errors.lastName : null}
              messageType={(showErrors && errors.lastName) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <Select
              required
              label="Genre"
              options={genderOptions}
              selected={form.gender || ''}
              onChange={(e) => updateForm({ gender: e.target.value })}
              message={(showErrors && errors.gender) ? errors.gender : null}
              messageType={(showErrors && errors.gender) ? 'error' : ''}
            />
          </Col>
          <Col n="12 md-6">
            <TextInput
              label="Activité"
              value={form.activity}
              onChange={(e) => updateForm({ activity: e.target.value })}
            />
          </Col>
          <Col n="12 md-6">
            <DateInput
              value={form.birthDate || ''}
              label="Date de naissance"
              onDateChange={((v) => updateForm({ birthDate: v }))}
            />
          </Col>
          <Col n="12 md-6">
            <DateInput
              value={form.deathDate || ''}
              label="Date de décès"
              onDateChange={((v) => updateForm({ deathDate: v }))}
            />
          </Col>
          <Col n="12 md-6">
            <TagInput
              label="Autres noms"
              hint='Valider votre ajout avec la touche "Entrée"'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
          isLoading={checking}
        />
      </Container>
    </form>
  );
}

PersonForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
PersonForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
