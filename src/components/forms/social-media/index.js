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

const regexpValidateSocialMedia = (type) => {
  const validator = {
    Dailymotion: [/^(https:\/\/)?(www.)?dailymotion.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.dailymotion.com/<compte>'],
    Facebook: [/^(https:\/\/)?(www.)?facebook.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.facebook.com/<compte>'],
    Github: [/^(https:\/\/)?(www.)?github.com\/0-9A-Za-z?$/, 'https://github.com/<compte>?tab=repositories'],
    Instagram: [/^(https:\/\/)?(www.)?instagram.com\/([0-9A-Za-z_]?)\/$/, 'https://www.instagram.com/<compte>/?hl=fr'],
    Twitter: [/^(https:\/\/)?(www.)?twitter.com\/[0-9A-Za-z_]{1,15}$/, 'https://twitter.com/<compte>'],
    Youtube: [/^(https:\/\/)?(www.)?youtube.com\/[A-Za-z0-9/:%_+.,#?!@&=-]+$/, 'https://www.youtube.com/channel/<chaine>'],
    Linkedin: [/^(https:\/\/)?(www.)?linkedin.com\/.+\/.+\/$/, 'https://www.linkedin.com/<profil>'],
  };
  return validator[type] || [null, null];
};

function validate(body) {
  const errorMessage = {};
  if (!body?.account) errorMessage.account = 'Le compte du réseaux social est obligatoire';
  if (!body?.type) errorMessage.type = 'Le type du réseaux social est obligatoire';
  const [regexp, error] = regexpValidateSocialMedia(body.type);
  if (regexp && !regexp.test(body.account)) errorMessage.account = `Veuillez bien renseigner votre compte, essayez ${error}`;
  return errorMessage;
}

function sanitize(form) {
  const fields = ['account', 'type'];
  const body = {};
  Object.keys(form).forEach((key) => {
    if (fields.includes(key)) { body[key] = form[key]; }
  });
  if (!form.account.includes('https://')) { body.account = `https://${body.account}`; }
  if (!form.account.includes('.fr')) { body.account = `${body.account}.fr`; }
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
