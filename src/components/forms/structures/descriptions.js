import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';

function sanitize(form) {
  const fields = ['descriptionFr', 'descriptionEn'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function StructureDescriptionForm({ data, onSave }) {
  const { form, updateForm } = useForm(data);

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
            <TextInput
              textarea
              label="Description française"
              onChange={(e) => updateForm({ descriptionFr: e.target.value })}
              value={form.descriptionFr}
            />
          </Col>
          <Col n="12">
            <TextInput
              textarea
              label="Description anglaise"
              onChange={(e) => updateForm({ descriptionEn: e.target.value })}
              value={form.descriptionEn}
            />
          </Col>
        </Row>
        <FormFooter onSaveHandler={() => onSave(sanitize(form))} />
      </Container>
    </form>
  );
}

StructureDescriptionForm.propTypes = {
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

StructureDescriptionForm.defaultProps = {
  data: {},
};
