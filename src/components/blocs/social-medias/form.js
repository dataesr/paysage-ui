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
import FormFooter from '../../forms/form-footer/form-footer';
import useForm from '../../../hooks/useForm';

export default function SocialMediaForm({ data, onDeleteHandler, onSaveHandler, enumKey }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validator);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/docs/enums').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setOptions(
          response.data[enumKey].enum.map((item) => ({
            label: item,
            value: item,
          })),
        );
        if (!data.type) {
          // valeur par défaut
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
              selected={form.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              tabIndex={0}
              required
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <TextInput
              label="Compte/URL"
              value={form.account}
              onChange={(e) => updateForm({ account: e.target.value })}
              required
              message={(showErrors && errors.account) ? errors.account : null}
              messageType={(showErrors && errors.account) ? 'error' : ''}
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

SocialMediaForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
  enumKey: PropTypes.string.isRequired,
};

SocialMediaForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
};
