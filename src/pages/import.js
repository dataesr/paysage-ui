import { Col, Container, Icon, Link, Row, Select, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';

import FormFooter from '../components/forms/form-footer';
import useForm from '../hooks/useForm';
import api from '../utils/api';
import { capitalize } from '../utils/strings';

const LINE_SEPARATOR = '\n';
const TSV_SEPARATOR = '\t';

const statusMapping = {
  O: 'active',
  F: 'inactive',
  P: 'forthcoming',
};
const types = ['structures'];

function sanitize(form) {
  const fields = [
    'types', 'data',
  ];
  const body = {};
  Object.keys(form).forEach((key) => { if (fields.includes(key)) { body[key] = form[key]; } });
  return body;
}

export default function ImportPage({ data }) {
  const { form, updateForm } = useForm(data);
  const [responses, setResponses] = useState([]);

  const handleUploadClick = async () => {
    const structuresTsv = JSON.parse(JSON.stringify(form.data)).split(LINE_SEPARATOR);
    const headers = structuresTsv.shift().split(TSV_SEPARATOR);
    const structuresJson = structuresTsv.filter((item) => item.length).map((item) => {
      const splittedItem = item.split(TSV_SEPARATOR);
      const objectItem = {};
      // Map field with header
      for (let i = 0; i < headers.length; i += 1) {
        const key = JSON.parse(JSON.stringify(headers[i]));
        objectItem[key] = splittedItem[i];
      }
      // Convert header title to API field name
      const structure = {
        usualName: objectItem['Nom usuel en français'],
        shortName: objectItem['Nom court en français'],
        acronymFr: objectItem['Sigle en français'],
        nameEn: objectItem['Nom long en anglais :'],
        acronymEn: objectItem['Nom court  en anglais :'],
        officialName: objectItem['Nom officiel dans la langue originale'],
        acronymLocal: objectItem['Nom court officiel dans la langue originale'],
        otherNames: objectItem['Autres dénominations possibles séparées par des ;']?.split(';'),
        structureStatus: statusMapping[objectItem['Statut [O = Ouvert, F = Fermé, P = Potentiel]']],
        categories: objectItem[JSON.stringify('Code de la/des catégories {rechercher le code, séparation ;}')]?.split(';'),
        legalCategory: objectItem['Code du statut juridique {rechercher le code}'],
        cityId: objectItem['Code commune {rechercher le code}'],
        idref: objectItem['Identifiant IdRef [123456789]'],
        wikidata: objectItem['Identifiant Wikidata [Q1234]'],
        ror: objectItem['Identifiant ROR [12cd5fg89]'],
        uai: objectItem['Code UAI [1234567X]'],
        siret: objectItem['Numéro siret [12345678901234]'],
        rnsr: objectItem['Numéro RNSR [123456789X]'],
        ed: objectItem["Numéro de l'ED [123]"],
        websiteFr: objectItem['Site internet en français'],
        websiteEn: objectItem['Site internet en anglais'],
        twitter: objectItem['Compte twitter [https://twitter.com/XXX]'],
        linkedIn: objectItem['Compte linkedIn [https://www.linkedin.com/in/XXX-XXX-123456/]'],
        // : objectItem['Mention de dInformation Scientifique et Techniqueribution :'],
        address: objectItem['Adresse :'],
        place: objectItem['Lieu dit :'],
        postOfficeBoxNumber: objectItem['Boite postale :'],
        postalCode: objectItem['Code postal :'],
        locality: objectItem["Localité d'acheminement :"],
        // iso3: objectItem[JSON.stringify('Nom du pays en français {rechercher le libellé ou le code ISO}')]?.toUpperCase(),
        creationDate: objectItem['Date de création {2020-07-02}'],
        // : objectItem['Date de création approximative {O = Oui, N = Non}'],
        closureDate: objectItem['Date de fermeture {2020-07-02}'],
        // : objectItem['Date de fermeture approximative {O = Oui, N = Non}'],
        // : objectItem['Parent {rechercher le code}'],
      };
      if (objectItem?.["Localisation [A1 = France métropolitaine et les DOM, A2 = Collectivités d'outre-mer, A3 = Hors de France]"] !== 'A3') {
        structure.country = 'France';
        structure.iso3 = 'FRA';
      }
      const latlng = objectItem['Coordonnées GPS [-12.34,5.6789]']?.split(',');
      if (latlng?.length === 2) {
        const [lat, lng] = latlng;
        structure.coordinates = { lat: Number(lat), lng: Number(lng) };
      }
      // Clean empty fields
      Object.keys(structure).forEach((key) => {
        const value = structure[key];
        if (value === '' || value === null || value === undefined) {
          delete structure[key];
        }
      });
      return structure;
    });
    const results = await Promise.all(structuresJson.map((structure) => api.post('/structures', structure)
      .then((response) => response)
      .catch((error) => { console.log(error.toString()); return ({ status: error?.message, statusText: error.toString(), data: {} }); })))
      .then((arrayOfValuesOrErrors) => arrayOfValuesOrErrors)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('ERROR');
        console.log(err.message); // some coding error in handling happened
      });
    console.log(results);
    setResponses(results);
    updateForm({ data: '' });
  };

  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12">
          <form acceptCharset="UTF-8">
            <Select
              label="Objet Paysage"
              options={types.map((el) => ({ label: capitalize(el), value: el }))}
              selected={form?.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              required
            />
            <TextInput
              label="Import en masse"
              onChange={(e) => updateForm({ data: e.target.value })}
              required
              rows="12"
              textarea
              value={form?.data}
            />
            <FormFooter
              onSaveHandler={() => handleUploadClick(sanitize(form))}
            />
          </form>
        </Col>
      </Row>
      {!!responses.length && (
        <Row>
          <Col n="12">
            <Row>
              <Col n="6">
                Acronyme - Nom
              </Col>
              <Col n="2">
                Status
              </Col>
              <Col n="4">
                Message
              </Col>
            </Row>
            {responses.map((response) => (
              <Row key={response.data.id}>
                <Col n="6">
                  {response?.data?.id && (
                    <Link href={`/structures/${response?.data?.id}`}>
                      {response?.data?.currentName?.shortName}
                      {' - '}
                      {response?.data?.currentName?.usualName}
                    </Link>
                  )}
                </Col>
                <Col n="2">
                  <Icon name={response?.status.toString()[0] === '2' ? 'ri-thumb-up-fill' : 'ri-thumb-down-fill'} />
                </Col>
                <Col n="4">
                  {response?.statusText}
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
}

ImportPage.propTypes = {
  data: PropTypes.object,
};

ImportPage.defaultProps = {
  data: {},
};
