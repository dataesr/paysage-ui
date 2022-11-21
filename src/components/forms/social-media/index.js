import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import useEnums from '../../../hooks/useEnums';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const ret = {};
  if (!body?.account) ret.account = 'Le compte/url du media social est obligatoire';
  if (!body?.type) ret.type = 'Le type du media social est obligatoire';
  if (body?.type.includes(body.account)) ret.account = `URL non valide - Exemple : compte ${body.type} [https://${body.type}.com/XXX] `;
  return ret;
}

function sanitize(form) {
  const fields = ['account', 'type'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function SocialMediaForm({ id, data, onDelete, onSave }) {
  const { socialMedias } = useEnums();
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm(data, validate);

  const onSubmitHandler = () => {
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
              options={socialMedias}
              selected={form.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              tabIndex={0}
              required
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
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
          onSaveHandler={onSubmitHandler}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

SocialMediaForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

SocialMediaForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
};
