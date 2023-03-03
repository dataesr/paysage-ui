import PropTypes from 'prop-types';
import { Col, Container, Row, TextInput, Select } from '@dataesr/react-dsfr';
import { useState } from 'react';
import TagInput from '../../tag-input';
import useForm from '../../../hooks/useForm';
import FormFooter from '../form-footer';
import PaysageBlame from '../../paysage-blame';

function validate(body) {
  const validationErrors = {};
  if (!body.longNameFr) { validationErrors.longNameFr = 'Le nom long en français est obligatoire'; }
  return validationErrors;
}

function sanitize(form) {
  const fields = [
    'longNameFr', 'shortNameFr', 'acronymFr', 'pluralNameFr', 'descriptionFr', 'inseeCode', 'wikidataId',
    'shortNameEn', 'longNameEn', 'sector', 'legalPersonality', 'websiteEn', 'websiteFr', 'comment', 'otherNames',
  ];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function LegalCategoriesForm({ id, data, onSave, onDelete }) {
  const { form, updateForm, errors } = useForm(data, validate);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length !== 0) return setShowErrors(true);
    const body = sanitize(form);
    return onSave(body, id);
  };

  const sectorOptions = [
    { value: null, label: "Sélectionner un type d'objet" },
    { value: 'public', label: 'Public' },
    { value: 'privé', label: 'Privé' },
    { value: 'sans objet', label: 'Sans objet' },
  ];
  const legalPersonalityOptions = [
    { value: null, label: "Sélectionner un type d'objet" },
    { value: 'personne morale de droit public', label: 'Personne morale de droit public' },
    { value: 'personne morale de droit privé', label: 'Personne morale de droit privé' },
    { value: 'organisation internationale', label: 'Organisation internationale' },
    { value: 'autre forme juridique étrangère', label: 'Autre forme juridique étrangère' },
    { value: 'sans personalité juridique', label: 'Sans personalité juridique' },
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
        <Row>
          <Col n="12" spacing="pb-3w">
            <TextInput
              required
              label="Nom long en français"
              value={form.longNameFr}
              onChange={(e) => updateForm({ longNameFr: e.target.value })}
              message={(showErrors && errors.longNameFr) ? errors.usualName : null}
              messageType={(showErrors && errors.longNameFr) ? 'error' : ''}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Nom court en français"
              value={form.shortNameFr}
              onChange={(e) => updateForm({ shortNameFr: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Acronyme en français"
              value={form.acronymFr}
              onChange={(e) => updateForm({ acronymFr: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Nom pluriel en français"
              value={form.pluralNameFr}
              onChange={(e) => updateForm({ pluralNameFr: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Description en français"
              onChange={(e) => updateForm({ descriptionFr: e.target.value })}
              textarea
              value={form.descriptionFr}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Code insee"
              value={form.inseeCode}
              onChange={(e) => updateForm({ inseeCode: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Identifiant wikidata"
              value={form.wikidataId}
              onChange={(e) => updateForm({ wikidataId: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Nom court en anglais"
              value={form.shortNameEn}
              onChange={(e) => updateForm({ shortNameEn: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Nom long en anglais"
              value={form.longNameEn}
              onChange={(e) => updateForm({ longNameEn: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <Select
              label="Secteur"
              selected={form.sector}
              options={sectorOptions}
              onChange={(e) => updateForm({ sector: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <Select
              label="Secteur"
              selected={form.legalPersonality}
              options={legalPersonalityOptions}
              onChange={(e) => updateForm({ legalPersonality: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Site web en anglais"
              value={form.websiteEn}
              onChange={(e) => updateForm({ websiteEn: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              label="Site web en français"
              value={form.websiteFr}
              onChange={(e) => updateForm({ websiteFr: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TextInput
              textarea
              label="Commentaire"
              value={form.comment}
              onChange={(e) => updateForm({ comment: e.target.value })}
            />
          </Col>
          <Col n="12" spacing="pb-3w">
            <TagInput
              label="Autres noms"
              hint='Valider votre ajout avec la touche "Entrée"'
              tags={form.otherNames || []}
              onTagsChange={(tags) => updateForm({ otherNames: tags })}
            />
          </Col>
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={handleSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}
LegalCategoriesForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
LegalCategoriesForm.defaultProps = {
  id: null,
  data: { otherNames: [] },
  onDelete: null,
};
