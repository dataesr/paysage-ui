import PropTypes from 'prop-types';
import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';
import TagInput from '../../tag-input';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';
import FormFooter from '../form-footer';

function validate(body) {
  const validationErrors = {};
  if (!body.name) { validationErrors.name = 'Le nom est obligatoire'; }
  if (!body.for?.length) { validationErrors.for = 'Ce champs est obligatoire'; }
  const priority = parseInt(body.priority, 10);
  if (priority > 99 || priority < 1) { validationErrors.for = 'Doit être compris en 1 (priorité forte) et 99 (priorité faible)'; }
  return validationErrors;
}
function sanitize(form) {
  const fields = ['name', 'pluralName', 'maleName', 'feminineName', 'priority', 'otherNames', 'for', 'mandateTypeGroup'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  body.priority = parseInt(body.priority, 10);
  return body;
}

export default function GeographicalCategoriesForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm({ priority: 99, for: [], ...data }, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  if (showErrors) { return null; }
  //   Attention modifier ici

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
            <TagInput
              label="Ajouter le nouveau polygone"
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
        />
      </Container>
    </form>
  );
}
GeographicalCategoriesForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
GeographicalCategoriesForm.defaultProps = {
  id: null,
  data: { for: [], priority: '99' },
  onDelete: null,
};
