import PropTypes from 'prop-types';
import { Checkbox, CheckboxGroup, Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
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
const objectNameMapper = [
  { name: 'Personnes', object: 'persons' },
  { name: 'Structures', object: 'structures' },
  { name: 'Prix', object: 'prizes' },
  { name: 'Projets', object: 'projects' },
  { name: 'Termes', object: 'terms' },
  { name: 'Catégories', object: 'categories' },
];

export default function RelationTypesForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm({ priority: 99, for: [], ...data }, validate);
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
              required
              label="Nom"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              message={(showErrors && errors.name) ? errors.name : null}
              messageType={(showErrors && errors.name) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom pluriel" value={form.pluralName} onChange={(e) => updateForm({ pluralName: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom au masculin" value={form.maleName} onChange={(e) => updateForm({ maleName: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput label="Nom au féminin" value={form.feminineName} onChange={(e) => updateForm({ feminineName: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput type="number" step="1" min="1" max="99" label="Priorité" value={form.priority} onChange={(e) => updateForm({ priority: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Valider votre ajout avec la touche "Entrée"'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <CheckboxGroup
              isInline
              legend="Pour: "
              message={(showErrors && errors.for) ? errors.for : null}
              messageType={(showErrors && errors.for) ? 'error' : ''}
            >
              {objectNameMapper.map((element) => (
                <Checkbox
                  checked={form.for.filter((f) => (f === element.object)).length}
                  size="sm"
                  onChange={(e) => updateForm({ for: ((e.target.checked) ? [...form.for, element.object] : form.for.filter((f) => (f !== element.object))) })}
                  label={element.name}
                />
              ))}
            </CheckboxGroup>
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              disabled={!form?.for?.includes('persons')}
              label="Groupe de gouvernance"
              hint="Groupe de gouvernance dans lequel appaîtra cette fonction. Uniquement pour les relations qui peuvent être associées aux personnes"
              value={form?.for?.includes('persons') ? form.mandateTypeGroup : ''}
              onChange={(e) => updateForm({ mandateTypeGroup: e.target.value })}
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
RelationTypesForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
RelationTypesForm.defaultProps = {
  id: null,
  data: { for: [], priority: '99' },
  onDelete: null,
};
