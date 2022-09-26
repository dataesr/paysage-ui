import PropTypes from 'prop-types';
import { Checkbox, CheckboxGroup, Col, Container, Row, Text, Title, TextInput, ButtonGroup } from '@dataesr/react-dsfr';
import { useState } from 'react';
import TagInput from '../../tag-input';
import useForm from '../../../hooks/useForm';
import Button from '../../button';

const objectNameMapper = [
  { name: 'Personnes', object: 'persons' },
  { name: 'Structures', object: 'structures' },
  { name: 'Prix', object: 'prices' },
  { name: 'Projets', object: 'projects' },
  { name: 'Termes', object: 'terms' },
  { name: 'Catégories', object: 'categories' },
];

export default function RelationGroupForm({ id, initialForm, onSave, onDelete }) {
  const validateForm = (body) => {
    const validationErrors = {};
    if (!body.name) { validationErrors.name = 'Le nom est obligatoire'; }
    if (!body.accepts?.length) { validationErrors.accepts = 'Ce champs est obligatoire'; }
    const priority = parseInt(body.priority, 10);
    if (priority > 99 || priority < 1) { validationErrors.accepts = 'Doit être compris en 1 (priorité forte) et 99 (priorité faible)'; }
    return validationErrors;
  };
  const { form, updateForm, errors } = useForm(initialForm, validateForm);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    form.priority = parseInt(form.priority, 10);
    return onSave(id, form);
  };

  const handleDelete = () => onDelete(id);

  return (
    <form onSubmit={handleSubmit}>
      <Container fluid>
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput
              required
              label="Nom du groupe de relation"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              message={(showErrors && errors.name) ? errors.name : null}
              messageType={(showErrors && errors.name) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput type="number" step="1" min="1" max="99" label="Priorité" value={form.priority} onChange={(e) => updateForm({ priority: e.target.value })} />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <CheckboxGroup
              isInline
              legend="Ce groupe pourra contenir:"
              message={(showErrors && errors.accepts) ? errors.accepts : null}
              messageType={(showErrors && errors.accepts) ? 'error' : ''}
            >
              {objectNameMapper.map((element) => (
                <Checkbox
                  checked={form.accepts.filter((f) => (f === element.object)).length}
                  size="sm"
                  onChange={(e) => updateForm({ accepts: ((e.target.checked) ? [...form.accepts, element.object] : form.accepts.filter((f) => (f !== element.object))) })}
                  label={element.name}
                />
              ))}
            </CheckboxGroup>
          </Col>
          <Col n="12">
            <ButtonGroup isInlineFrom="md" align="right">
              <Button submit icon="ri-save-line">Enregistrer</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <hr />
        {id && (
          <>
            <Title as="h2" look="h6">Supprimer ce type de relation</Title>
            <Text>Attention ! Cette suppression sera définitive.</Text>
            <ButtonGroup isInlineFrom="md">
              <Button secondary onClick={handleDelete} color="error" icon="ri-delete-bin-2-line">
                Supprimer
              </Button>
            </ButtonGroup>
          </>
        )}
      </Container>
    </form>
  );
}
RelationGroupForm.propTypes = {
  id: PropTypes.string,
  initialForm: PropTypes.oneOfType([PropTypes.shape, null]),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
RelationGroupForm.defaultProps = {
  id: null,
  initialForm: { accepts: [], priority: '99' },
};
