import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import FormFooter from '../../forms/form-footer';
import useForm from '../../../hooks/useForm';
import useEnums from '../../../hooks/useEnums';

export default function SocialMediaForm({ data, onDeleteHandler, onSaveHandler }) {
  const validator = (body) => {
    const ret = {};
    if (!body?.account) ret.account = 'Le compte/url du media social est obligatoire';
    if (!body?.type) ret.type = 'Le type du media social est obligatoire';
    return ret;
  };
  const { socialMedias } = useEnums();
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
              options={socialMedias}
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
};

SocialMediaForm.defaultProps = {
  data: {},
  onDeleteHandler: null,
};
