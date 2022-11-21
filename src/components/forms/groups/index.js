import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import useForm from '../../../hooks/useForm';
import FormFooter from '../form-footer';
import PaysageBlame from '../../paysage-blame';
import TagInput from '../../tag-input';

function validate(body) {
  const validationErrors = {};
  if (!body.name) { validationErrors.name = 'Le nom du groupe est obligatoire'; }
  return validationErrors;
}

function sanitize(form) {
  const fields = ['name', 'description', 'acronym', 'otherNames'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function GroupForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm(data, validate);
  const [showErrors, setShowErrors] = useState(false);

  const onSubmitHandler = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

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
            <TextInput
              label="Nom du groupe"
              required
              value={form.name || ''}
              onChange={(e) => updateForm({ name: e.target.value })}
              message={(showErrors && errors.name) ? errors.name : null}
              messageType={(showErrors && errors.name) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Acronyme du groupe"
              required
              value={form.acronym || ''}
              onChange={(e) => updateForm({ acronym: e.target.value })}
              message={(showErrors && errors.acronym) ? errors.acronym : null}
              messageType={(showErrors && errors.acronym) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-2w">
            <TextInput
              label="Description du groupe"
              value={form.description || ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              message={(showErrors && errors.description) ? errors.description : null}
              messageType={(showErrors && errors.description) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Valider votre ajout avec la touche "Entrée"'
              tags={form.otherNames}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={onSubmitHandler}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}
GroupForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
GroupForm.defaultProps = {
  id: null,
  data: {},
};
