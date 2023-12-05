import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';
import FormFooter from '../form-footer';

function validate(body) {
  console.log(body);
  const validationErrors = {};
  return validationErrors;
}
function sanitize(form) {
  const fields = ['geometry'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  body.priority = parseInt(body.priority, 10);
  return body;
}

export default function GeographicalCategoriesForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm({ priority: 99, for: [], ...data }, validate);
  const [showErrors, setShowErrors] = useState(false);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  if (showErrors) { return null; }

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
              label="Polygone (en format multipolygone)"
              onChange={(e) => updateForm({ geometry: e.target.value })}
              required
              rows="12"
              textarea
              value={form.geometry}
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
