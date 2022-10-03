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

export default function WeblinkForm({ data, onDeleteHandler, onSaveHandler, options }) {
  const validator = (body) => {
    const ret = {};
    if (!body?.type) ret.type = 'Le type est obligatoire';
    if (!body?.url) ret.url = "L'URL est obligatoire";
    return ret;
  };
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validator);

  const onSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    return onSaveHandler(form);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
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
        </Row>
        <Row className="fr-pt-2w">
          <Col>
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
