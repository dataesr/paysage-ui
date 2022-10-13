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
  return body;
}

export default function WeblinkForm({ data, onDeleteHandler, onSaveHandler, options }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validate);

  const onSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSaveHandler(body);
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
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={onSave}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

WeblinkForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape),
};

WeblinkForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
  options: [],
};
