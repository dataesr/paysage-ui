import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
  RadioGroup,
  Radio,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import DateInput from '../../date-input';
import validator from './validator';
import FormFooter from '../../forms/form-footer';
import useForm from '../../../hooks/useForm';
import useUrl from '../../../hooks/useUrl';
import useEnums from '../../../hooks/useEnums';

export default function IdentifierForm({ data, onDeleteHandler, onSaveHandler }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm({ active: true, ...data }, validator);
  const { apiObject } = useUrl();
  const { identifiers } = useEnums();
  const options = identifiers?.[apiObject];

  const onSave = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    return onSaveHandler(form);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <RadioGroup isInline>
              <Radio
                label="Actif"
                value
                checked={form?.active}
                onChange={(e) => updateForm({ active: true })}
              />
              <Radio
                label="Inactif"
                value={false}
                checked={!form?.active}
                onChange={() => updateForm({ active: false })}
              />
            </RadioGroup>
          </Col>
        </Row>
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
              label="Valeur"
              value={form?.value}
              onChange={(e) => updateForm({ value: e.target.value })}
              required
              message={(showErrors && errors.value) ? errors.value : null}
              messageType={(showErrors && errors.value) ? 'error' : ''}
            />
          </Col>
        </Row>
        <Row className="fr-pt-3w">
          <Col>
            <DateInput
              value={form?.startDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ startDate: value })}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DateInput
              value={form?.endDate}
              label="Date de début"
              onDateChange={(value) => updateForm({ endDate: value })}
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

IdentifierForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

IdentifierForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
