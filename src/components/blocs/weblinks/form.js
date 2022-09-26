import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import validator from './validator';
import FormFooter from '../../forms/form-footer';
import useForm from '../../../hooks/useForm';
import { WEBLINKS_TYPES } from '../../../utils/constants';

export default function WeblinkForm({ data, onDeleteHandler, onSaveHandler, enumKey }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validator);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/docs/enums').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        const opts = [];
        response.data[enumKey].enum.forEach((item) => {
          if (Object.keys(WEBLINKS_TYPES).includes(item)) {
            opts.push({
              label: WEBLINKS_TYPES[item],
              value: item,
            });
          }
        });
        setOptions(opts);

        if (!data?.type) {
          updateForm({ type: response.data[enumKey].enum[0] });
        }
      }
    };
    getOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, enumKey]);

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
              messageType={(showErrors && errors.type) ? 'error' : ''}
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
              messageType={(showErrors && errors.url) ? 'error' : ''}
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
  enumKey: PropTypes.string.isRequired,
};

WeblinkForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
};
