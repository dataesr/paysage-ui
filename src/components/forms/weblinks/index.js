import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';

const langOptions = [
  { label: 'Français', value: 'fr' },
  { label: 'Anglais', value: 'en' },
  { label: 'Allemand', value: 'de' },
  { label: 'Espagnol', value: 'es' },
  { label: 'Italien', value: 'it' },
  { label: 'Potuguais', value: 'pt' },
  { label: 'Chinois', value: 'cn' },
  { label: 'Arabe', value: 'ar' },
  { label: 'Autre langue', value: 'na' },
];

function validate(body) {
  const ret = {};
  if (!body?.type) ret.type = 'Le type est obligatoire';
  if (!body?.url) ret.url = "L'URL est obligatoire";
  return ret;
}

function sanitize(form) {
  const fields = ['type', 'url', 'language'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  if (body.type !== 'website') {
    body.language = null;
  }
  return body;
}

export default function WeblinkForm({ id, data, onDelete, onSave, options }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm({ language: 'fr', ...data }, validate);

  const onSubmit = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
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
        <Row gutters>
          <Col n="12">
            <Select
              label="Type"
              options={options}
              selected={form?.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              tabIndex={0}
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : null}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="URL"
              value={form?.url}
              onChange={(e) => updateForm({ url: e.target.value })}
              required
              message={(showErrors && errors.url) ? errors.url : null}
              messageType={(showErrors && errors.url) ? 'error' : null}
            />
          </Col>
          {(form.type === 'website') && (
            <Col n="12">
              <Select
                label="Langue du site"
                options={langOptions}
                selected={form.language}
                onChange={(e) => updateForm({ language: e.target.value })}
              />
            </Col>
          )}
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={onSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

WeblinkForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape),
};

WeblinkForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
  options: [],
};
