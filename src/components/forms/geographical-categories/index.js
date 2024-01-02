import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';
import FormFooter from '../form-footer';

function validate(body) {
  const validationErrors = {};
  if (!body.geometry) {
    validationErrors.geometry = 'Renseignez les nouvelles coordonnées';
  }

  return validationErrors;
}

function sanitize(form) {
  const fields = ['geometry'];
  const body = {};
  Object.keys(form).forEach((key) => {
    if (fields.includes(key)) {
      body[key] = form[key];
    }
  });
  return body;
}

export default function GeographicalCategoriesForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm(
    { geometry: { coordinates: [] }, ...data },
    validate,
  );
  const [showErrors, setShowErrors] = useState(false);

  const handleGeometryChange = (e) => {
    const newCoordinates = e.target.value;
    updateForm({ geometry: { coordinates: [newCoordinates] } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) {
      return setShowErrors(true);
    }
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
              label="Polygone (en format multipolygone)"
              onChange={handleGeometryChange}
              required
              rows="12"
              textarea
              value={form.geometry.coordinates}
              message={showErrors && errors.geometry ? errors.geometry : null}
              messageType={showErrors && errors.geometry ? 'error' : ''}
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
