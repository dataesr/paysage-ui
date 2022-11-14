import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';
import TagInput from '../../tag-input';
import FormFooter from '../form-footer';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const validationErrors = {};
  if (!body.usualName) { validationErrors.usualName = 'Le nom usuel est obligatoire'; }
  return validationErrors;
}
function sanitize(form) {
  const fields = ['usualName', 'otherNames'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}
export default function NomenclatureForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm(data, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
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
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Nom"
              required
              value={form.usualName || ''}
              onChange={(e) => updateForm({ usualName: e.target.value })}
              message={(showErrors && errors.usualName) ? errors.usualName : null}
              messageType={(showErrors && errors.usualName) ? 'error' : ''}
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
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}
NomenclatureForm.propTypes = {
  data: PropTypes.object,
  id: PropTypes.string,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

NomenclatureForm.defaultProps = {
  data: { usualName: null, otherNames: [] },
  id: null,
  onDelete: null,
};
