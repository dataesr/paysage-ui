import { Button, ButtonGroup, Col, Container, Radio, RadioGroup, Row, Select, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';

function validate(body) {
  const validationErrors = {};
  if (!body.name) { validationErrors.name = 'Renseignez le nom de la tâche'; }
  return validationErrors;
}

function sanitize(form) {
  const fields = [
    'name',
    'repeatInterval',
    'data',
  ];
  return Object.entries(form).reduce((acc, [key, val]) => {
    if (fields.includes(key)) return { ...acc, [key]: val };
    return acc;
  }, {});
}

export default function CreateTaskForm({ definitions, onCancel, onCreate }) {
  const { form, updateForm, errors } = useForm({ type: 'now' }, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleCreate = async () => {
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onCreate(body);
  };
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <form>
      <Container fluid>
        <Row gutters>
          <Col n="12">
            <Select
              required
              label="Choisissez un tâche"
              options={[{ label: 'Séléctionnez...', value: '', disabled: true, hidden: true }, ...definitions.map((def) => ({ label: def, value: def }))]}
              selected={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              message={(showErrors && errors.name) ? errors.name : undefined}
              messageType={(showErrors && errors.name) ? 'error' : undefined}
            />
          </Col>
          <Col n="12">
            <TextInput
              textarea
              label="Indiquez des paramêtres pour cette tâche"
              hint="Les paramêtres de la tâche doivent être au format json"
              value={form.data || ''}
              onChange={(e) => updateForm({ data: e.target.value })}
              message={(showErrors && errors.data) ? errors.data : null}
              messageType={(showErrors && errors.data) ? 'error' : ''}
              rows="6"
            />
          </Col>
          <Col n="12">
            <RadioGroup
              className="fr-m-0"
              legend="Comment souhaitez-vous exécuter la tâche ?"
              isInline
              onChange={(newType) => { updateForm({ type: newType }); }}
            >
              <Radio
                label="Immédiatement"
                value="now"
                checked={form.type === 'now'}
                hint="Cette tâche sera lancée dès sa création"
              />
              <Radio
                label="De manière répétée"
                value="every"
                checked={form.type === 'every'}
                hint="Cette tâche sera répétée à un interval régulier définie par une expression cron"
              />
            </RadioGroup>
          </Col>
          <Col n="12">
            <TextInput
              required={(form.type === 'every')}
              label="Interval de répétiton"
              hint="Répétition de la tâche au format cron"
              disabled={(form.type === 'now')}
              className={(form.type === 'now') ? 'fr-input-group--disabled' : ''}
              value={form.repeatInterval || ''}
              onChange={(e) => updateForm({ repeatInterval: e.target.value })}
              message={(showErrors && errors.repeatInterval) ? errors.repeatInterval : null}
              messageType={(showErrors && errors.repeatInterval) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <hr />
            <ButtonGroup>
              <Button onClick={handleCreate}>Créer la tâche</Button>
              <Button secondary onClick={handleCancel}>Annuler</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

CreateTaskForm.propTypes = {
  definitions: PropTypes.array.isRequired,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
};
CreateTaskForm.defaultProps = {
  onCancel: null,
  onCreate: null,
};
