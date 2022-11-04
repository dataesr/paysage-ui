import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  RadioGroup,
  Radio,
} from '@dataesr/react-dsfr';
import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';

function sanitize(form) {
  const fields = ['structureStatus'];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function StructureStatusForm({ data, onSave }) {
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
            <RadioGroup isInline>
              <Radio
                label="Actif"
                value="active"
                checked={form.structureStatus === 'active'}
                onChange={(e) => updateForm({ structureStatus: e.target.value })}
              />
              <Radio
                label="Inactif"
                value="inactive"
                checked={form.structureStatus === 'inactive'}
                onChange={(e) => updateForm({ structureStatus: e.target.value })}
              />
              <Radio
                label="A venir"
                value="forthcoming"
                checked={form.structureStatus === 'forthcoming'}
                onChange={(e) => updateForm({ structureStatus: e.target.value })}
              />
            </RadioGroup>
          </Col>
        </Row>
        <FormFooter onSaveHandler={() => onSave(sanitize(form))} />
      </Container>
    </form>
  );
}

StructureStatusForm.propTypes = {
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

StructureStatusForm.defaultProps = {
  data: {},
};
