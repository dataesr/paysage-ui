import PropTypes from 'prop-types';
import {
  Col,
  Container,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import TagInput from '../../tag-input';
import FormFooter from '../form-footer';

export default function PersonForm({ id, initialForm, onSave, onDelete }) {
  const validator = (body) => {
    const validationErrors = {};
    if (!body.firstName) { validationErrors.title = 'Le prénom est obligatoire.'; }
    if (!body.lastName) { validationErrors.eventDate = 'Le nom est obligatoire.'; }
    if (!body.gender) { validationErrors.type = 'Le genre est obligatoire.'; }
    return validationErrors;
  };

  const { form, updateForm, errors } = useForm(initialForm, validator);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    return onSave(form);
  };
  const genderOptions = [
    { value: '', label: 'Selectionner' },
    { value: 'Homme', label: 'Homme' },
    { value: 'Femme', label: 'Femme' },
    { value: 'Autre', label: 'Autre' },
  ];

  return (
    <form>
      <Container fluid className="fr-pb-6w">
        <Row className="fr-pb-5w">
          <Col n="12" spacing="pb-2w">
            <Select
              label="Genre"
              options={genderOptions}
              selected={form.gender || ''}
              onChange={(e) => updateForm({ gender: e.target.value })}
              message={(showErrors && errors.gender) ? errors.gender : null}
              messageType={(showErrors && errors.gender) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Prénom"
              value={form.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
              message={(showErrors && errors.fistName) ? errors.fistName : null}
              messageType={(showErrors && errors.fistName) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              required
              label="Nom"
              value={form.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
              message={(showErrors && errors.lastName) ? errors.lastName : null}
              messageType={(showErrors && errors.lastName) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms -- alias"
              hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <DateInput
              value={form.birthDate || ''}
              label="Date de naissance"
              onDateChange={((v) => updateForm({ birthDate: v }))}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <DateInput
              value={form.deathDate || ''}
              label="Date de décès"
              onDateChange={((v) => updateForm({ deathDate: v }))}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Activité"
              value={form.activity}
              onChange={(e) => updateForm({ activity: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Commentaire"
              value={form.comment}
              onChange={(e) => updateForm({ comment: e.target.value })}
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

PersonForm.propTypes = {
  id: PropTypes.string,
  initialForm: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
PersonForm.defaultProps = {
  id: null,
  initialForm: {},
  onDelete: null,
};
