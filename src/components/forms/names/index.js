import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
  Title,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useForm from '../../../hooks/useForm';
import DateInput from '../../date-input';
import PaysageBlame from '../../paysage-blame';
import TagInput from '../../tag-input';
import FormFooter from '../form-footer';

function validate(body) {
  const ret = {};
  if (!body.usualName) ret.usualName = 'Le nom usuel est obligatoire';
  return ret;
}
function sanitize(form) {
  const fields = [
    'officialName', 'usualName', 'brandName', 'shortName', 'nameEn',
    'otherNames', 'acronymFr', 'acronymEn', 'acronymLocal', 'startDate',
    'endDate', 'article',
  ];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function NameForm({ id, data, onDelete, onSave }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm({ active: true, ...data }, validate);

  const onSubmitHandler = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };
  const options = [
    { label: "à l'", value: "à l'" },
    { label: 'à', value: 'à' },
    { label: 'à la', value: 'à la' },
    { label: 'dans le', value: 'dans le' },
    { label: 'dans les', value: 'dans les' },
    { label: 'aux', value: 'aux' },
    { label: 'au', value: 'au' },
    { label: 'sans article', value: null },
  ];

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
              label="Nom usuel"
              value={form.usualName || ''}
              onChange={(e) => updateForm({ usualName: e.target.value })}
              required
              message={(showErrors && errors.usualName) ? errors.usualName : null}
              messageType={(showErrors && errors.usualName) ? 'error' : ''}
            />
          </Col>
          <Col n="12">
            <Select
              label="Article"
              options={options}
              selected={form.article}
              onChange={(e) => updateForm({ article: e.target.value })}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Nom officiel"
              value={form.officialName || ''}
              onChange={(e) => updateForm({ officialName: e.target.value })}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Nom de marque"
              value={form.brandName || ''}
              onChange={(e) => updateForm({ brandName: e.target.value })}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Nom court"
              value={form.shortName || ''}
              onChange={(e) => updateForm({ shortName: e.target.value })}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="Nom anglais"
              value={form.nameEn || ''}
              onChange={(e) => updateForm({ nameEn: e.target.value })}
            />
          </Col>
          <Col n="12">
            <TagInput
              label="Autres noms"
              hint='Validez votre ajout avec la touche "Entrée"'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
          <Col n="12"><Title as="h3" look="h6" spacing="mb-0">Acronymes</Title></Col>
          <Col n="12 sm-4">
            <TextInput
              label="FR"
              value={form.acronymFr || ''}
              onChange={(e) => updateForm({ acronymFr: e.target.value })}
            />
          </Col>
          <Col n="12 sm-4">
            <TextInput
              label="EN"
              value={form.acronymEn || ''}
              onChange={(e) => updateForm({ acronymEn: e.target.value })}
            />
          </Col>
          <Col n="12 sm-4">
            <TextInput
              label="Local"
              value={form.acronymLocal || ''}
              onChange={(e) => updateForm({ acronymLocal: e.target.value })}
            />
          </Col>
          <Col n="12"><Title as="h3" look="h6" spacing="mb-0">Dates</Title></Col>
          <Col n="12">
            <DateInput
              value={form.startDate}
              label="Date de début"
              onDateChange={(v) => updateForm({ startDate: v })}
            />
          </Col>
          <Col n="12">
            <DateInput
              value={form.endDate}
              label="Date de fin"
              onDateChange={(v) => updateForm({ endDate: v })}
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

NameForm.propTypes = {
  data: PropTypes.object,
  id: PropTypes.string,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

NameForm.defaultProps = {
  data: {},
  id: null,
  onDelete: null,
};
