import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import FormFooter from '../form-footer';
import useForm from '../../../hooks/useForm';
import PaysageBlame from '../../paysage-blame';

const langOptions = [
  { label: 'Français', value: 'fr' },
  { label: 'Anglais', value: 'en' },
  { label: 'Allemand', value: 'de' },
  { label: 'Espagnol', value: 'es' },
  { label: 'Italien', value: 'it' },
  { label: 'Potuguais', value: 'pt' },
  { label: 'Chinois', value: 'cn' },
  { label: 'Arabe', value: 'ar' },
  { label: 'Autre langue', value: 'na' },
];

const regexpValidateWebSite = {
  EducPros: /^https:\/\/www.letudiant.fr\/educpros\/personnalites\/.+.html$/,
  Hal: /^(https?):\/\/[A-Za-z0-9/:%+.,#?!@&=-]+$/,
  Onisep: /^(https?):\/\/www.onisep.fr\/http\/redirection\/etablissement\/identifiant\/\d+$/,
  POpenData: /^(https?):\/\/[A-Za-z0-9/:%+.,#?!@&=-]+$/,
  DataGouvFr: /^(https?):\/\/[A-Za-z0-9/:%+.,#?!@&=-]+$/,
  mooc: /^(https:\/\/)?(www.)?fun-mooc.fr\/universities\/[A-Za-z0-9/:%+.,#?!@&=-]+\/$/,
  CanalU: /^(https:\/\/)?(www.)?canal-u.tv\/chaines\/[\w\-_]*$/,
  ServicePublic: /^(https:\/\/)?(www.)?lannuaire.service-public.fr\/(gouvernement|institutions-juridictions|autorites-independantes)\/[^0-9][0-9]$/,
  LeMonde: /^https:\/\/www.lemonde.fr\/[a-z]+(-[a-z]+)*\/$/,
  TheConversation: /^https:\/\/theconversation.com\/profiles\/[a-z-]{1,}-[0-9]{1,}$/,
  TalentCNRS: /^https?:\/\/www.cnrs\.fr\/fr\/personne\/[a-z-]+(-0)?$/,
  IUF: /^https:\/\/www.iufrance\.fr\/les-membres-de-liuf\/membre\/[1-9]\d*([a-z-]*)?\.html$/,
  jorfsearch: /^https:\/\/jorfsearch.steinertriples.ch\/name\/[A-Za-z0-9%-]+$/,
  EdCF: /^https:\/\/doctorat.campusfrance.org\//,
  OE1: /^https:\/\/books.openedition.org\//,
  OE2: /^<W<<<<<>W<W>><Whttps:\/\/www.openedition.org\/catalogue-journals\?limit=30/,
  OE3: /^https:\/\/www.openedition.org\/\d{1,8}$/,
  hceres: /^https:\/\/www.hceres.fr\/fr\/[a-z0-9/-]+$/,

};

function validate(body) {
  const errorMessage = {};
  if (!body?.url) errorMessage.url = 'Le compte/url du réseaux social est obligatoire';
  if (!body?.type) errorMessage.type = 'Le type du réseaux social est obligatoire';
  const validationRule = regexpValidateWebSite?.[body.type];
  if (validationRule && !validationRule.test(body.url)) errorMessage.url = 'Veuillez bien renseigner votre compte';
  return errorMessage;
}

function sanitize(form) {
  const fields = ['type', 'url', 'language'];
  const body = {};
  Object.keys(form).forEach((key) => {
    if (fields.includes(key)) { body[key] = form[key]; }
  });
  if (body.type !== 'website') {
    body.language = null;
  }
  if (!form.url.includes('https://')) { body.url = `https://${body.url}`; }
  if (!form.url.includes('.fr')) { body.url = `${body.url}.fr`; }
  return body;
}

export default function WeblinkForm({ id, data, onDelete, onSave, options }) {
  const [showErrors, setShowErrors] = useState(false);
  const { form, updateForm, errors } = useForm({ language: 'fr', ...data }, validate);

  const onSubmit = () => {
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
              options={options}
              selected={form?.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              tabIndex={0}
              message={(showErrors && errors.type) ? errors.type : null}
              messageType={(showErrors && errors.type) ? 'error' : null}
            />
          </Col>
          <Col n="12">
            <TextInput
              label="URL"
              value={form?.url}
              onChange={(e) => updateForm({ url: e.target.value })}
              required
              message={(showErrors && errors.url) ? errors.url : null}
              messageType={(showErrors && errors.url) ? 'error' : null}
            />
          </Col>
          {(form.type === 'website') && (
            <Col n="12">
              <Select
                label="Langue du site"
                options={langOptions}
                selected={form.language}
                onChange={(e) => updateForm({ language: e.target.value })}
              />
            </Col>
          )}
        </Row>
        <FormFooter
          id={id}
          onSaveHandler={onSubmit}
          onDeleteHandler={onDelete}
        />
      </Container>
    </form>
  );
}

WeblinkForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape),
};

WeblinkForm.defaultProps = {
  id: null,
  data: {},
  onDelete: null,
  options: [],
};
