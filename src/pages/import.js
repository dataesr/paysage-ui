import { Accordion, AccordionItem, Alert, Button, Col, Container, Icon, Link, Row, Select, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { capitalize } from '../utils/strings';
import { Spinner } from '../components/spinner';
import api from '../utils/api';
import FormFooter from '../components/forms/form-footer';
import useForm from '../hooks/useForm';

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
  const [checkedResponsesWithWarnings, setCheckedResponsesWithWarnings] = useState([]);
  const [checkedResponsesWithNoWarnings, setCheckedResponsesWithNoWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState([]);
  const { form, updateForm } = useForm(data);

  const checkUploadOnClick = async () => {
    setIsLoading(true);
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
        parent: objectItem['Parent {rechercher le code}'],
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
      Object.keys(structure).forEach((key) => {
        const value = structure[key];
        if (value === '' || value === null || value === undefined) {
          delete structure[key];
        }
      });

      return structure;
    });
    setQueries(structuresJson);

    const checkName = (name, index) => api.get(`/autocomplete?types=structures&query=${name}`)
      .then((response) => {
        const responsesWithNameToCheck = response.data.data.map((el) => el.name);
        const idOfExistingStructure = response.data.data.find((el) => el.name === name)?.id;
        if (responsesWithNameToCheck.includes(name)) {
          return { name, index, warnings: [{ message: `${name} est probablement un doublon` }], id: idOfExistingStructure };
        }
        return { name, index, warnings: [], id: null };
      });
    const namePromises = structuresJson.map((element, index) => checkName(element.usualName, index));
    const results = await Promise.all(namePromises);
    const allResults = structuresJson.map((element, index) => {
      const result = results.find((r) => r.index === index);
      const tmp = { ...element, index };
      if (result?.warnings?.length > 0) { tmp.warnings = result.warnings; }
      return tmp;
    });
    const warnings = allResults.filter((el) => el.warnings && el.warnings.length > 0);
    const noWarnings = allResults.filter((el) => !el.warnings);
    setCheckedResponsesWithWarnings(warnings);
    setCheckedResponsesWithNoWarnings(noWarnings);
    setIsLoading(false);
  };

  const onClickToSave = async (structure) => {
    const saveResponse = await api.post('/structures', structure)
      .then((response) => response)
      .catch((error) => ({ status: error?.message, statusText: `${error?.error} : ${JSON.stringify(error?.details?.[0])}`, data: {} }));
    return saveResponse;
  };

  const handleUploadClick = async () => {
    setIsLoading(true);
    setQueries(checkedResponsesWithNoWarnings);
    const responsesPromises = await Promise.all(checkedResponsesWithNoWarnings.map((structure) => onClickToSave(structure)));
    const parentsPromises = await Promise.all(responsesPromises.map((result, index) => {
      const resourceId = checkedResponsesWithNoWarnings?.[index]?.parent;
      const relatedObjectId = result?.data?.id;
      if (resourceId && relatedObjectId) {
        return api.post('/relations', { resourceId, relatedObjectId, relationTag: 'structure-interne' })
          .then((response) => response)
          .catch((error) => ({ status: error?.message, statusText: `${error?.error} : ${JSON.stringify(error?.details?.[0])}`, data: {} }));
      }
      return Promise.resolve(null);
    }));
    setParents(parentsPromises);
    updateForm({ data: '' });
    setResponses(responsesPromises);
    setIsLoading(false);
  };

  return (
    <Container spacing="py-6w">
      <Row gutters>
        <Col n="12">
          <form acceptCharset="UTF-8">
            <Select
              label="Objet Paysage"
              options={types.map((el) => ({ label: capitalize(el), value: el }))}
              selected={form?.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              required
            />
            <p>
              Récupérer le
              {' '}
              <Link href="/models/AjoutEnMasseStructure.xlsx">fichier modèle</Link>
              , le remplir (une ligne correspond à un élément), copier puis coller dans le champ ci-dessous les cellules correspondant aux éléments à ajouter.
            </p>
            <TextInput
              label="Import en masse"
              onChange={(e) => updateForm({ data: e.target.value })}
              required
              rows="12"
              textarea
              value={form?.data}
            />
            <Row>
              <Col>
                <Button onClick={() => checkUploadOnClick(sanitize(form))}>Vérification</Button>
              </Col>
              {form?.data?.length > 0 && (
                <Col>
                  <Button
                    colors={['#f55', '#fff']}
                    onClick={() => updateForm({ data: '' })}
                  >
                    Effacer
                  </Button>
                </Col>
              )}
            </Row>
          </form>
        </Col>
      </Row>
      {isLoading && <Row className="fr-my-2w flex--space-around"><Spinner /></Row>}
      {(checkedResponsesWithNoWarnings?.length) > 0 && (
        <Row gutters>
          <Col n="12">
            <Col n="12">
              <Alert
                description={`Il y a ${checkedResponsesWithNoWarnings?.length} vérification(s) avec succés`}
                title="Succes"
                type="success"
              />
            </Col>
            <Accordion>
              <AccordionItem
                title="Voir toutes les vérifications avec succés"
              >
                <Col n="12">
                  <Row gutters key="headers">
                    <Col n="1">
                      Ligne
                    </Col>
                    <Col n="3">
                      Nom de la structure
                    </Col>
                  </Row>
                  {checkedResponsesWithNoWarnings?.sort((a, b) => a.index - b.index).map((response, index) => (
                    <Row gutters key={index}>
                      <Col n="1">
                        {response.index + 1}
                      </Col>
                      <Col n="3">
                        <span>
                          {response?.usualName}
                        </span>
                      </Col>
                    </Row>
                  ))}
                </Col>
              </AccordionItem>
            </Accordion>
          </Col>
        </Row>
      ) }
      {checkedResponsesWithWarnings?.length > 0 && (
        <Row gutters>
          <Col n="12">
            <Col n="12">
              <Alert
                description={`Il y a ${checkedResponsesWithWarnings?.length} warning`}
                title="Warning"
                type="warning"
              />
            </Col>
            <Accordion>
              <AccordionItem
                title="Voir tous les warnings"
              >
                <Col n="12">
                  <Row gutters key="headers">
                    <Col n="1">
                      Ligne
                    </Col>
                    <Col n="3">
                      Nom de la structure
                    </Col>
                    <Col n="5">
                      Warnings
                    </Col>
                  </Row>
                  {checkedResponsesWithWarnings?.map((response, index) => (
                    (response?.warnings?.length > 0
                      && (
                        <Row gutters key={index}>
                          <Col n="1">
                            {response.index + 1}
                          </Col>
                          <Col n="3">
                            <span>
                              {response?.usualName}
                            </span>
                            {response?.id && (
                              <Col>
                                <Link target="_blank" href={`/structures/${response?.id}`}>
                                  Vérifiez
                                </Link>
                              </Col>
                            )}
                          </Col>
                          <Col n="5">
                            <span>
                              {response?.warnings?.map((warning) => warning.message).join(',')}
                            </span>
                          </Col>
                          <Col>
                            <Button
                              colors={['#f55', '#fff']}
                              onClick={async () => {
                                const saveResponse = await onClickToSave(response);
                                const ignoredResponse = checkedResponsesWithWarnings.splice(index, 1)[0];
                                setCheckedResponsesWithWarnings(checkedResponsesWithWarnings);
                                setCheckedResponsesWithNoWarnings([...checkedResponsesWithNoWarnings, ignoredResponse]);
                                setResponses([...responses, saveResponse]);
                              }}
                              size="sm"
                            >
                              Ignorer le warning
                            </Button>
                          </Col>
                        </Row>
                      )
                    )
                  ))}
                </Col>
              </AccordionItem>
            </Accordion>
          </Col>
        </Row>
      )}
      {(!checkedResponsesWithWarnings.length) && (
        <FormFooter
          onSaveHandler={() => handleUploadClick(sanitize(form))}
        />
      ) }
      {!!responses.length && (
        <Row>
          <Col n="12">
            <Row key="headers">
              <Col n="1">
                Ligne
              </Col>
              <Col n="1">
                Status
              </Col>
              <Col n="3">
                Acronyme - Nom
              </Col>
              <Col n="1">
                Id
              </Col>
              <Col n="3">
                Message
              </Col>
              <Col n="3">
                Parent
              </Col>
            </Row>
            {responses.map((response, index) => (
              <Row key={index}>
                <Col n="1">
                  {index + 1}
                </Col>
                <Col n="1">
                  <Icon
                    color={response?.status?.toString()?.[0] === '2' ? 'var(--green-menthe-main-548)' : 'var(--orange-terre-battue-main-645)'}
                    name={response?.status?.toString()?.[0] === '2' ? 'ri-thumb-up-fill' : 'ri-thumb-down-fill'}
                  />
                </Col>
                <Col n="3">
                  {response?.data?.id ? (
                    <Link href={`/structures/${response?.data?.id}`}>
                      <span>
                        {queries?.[index]?.acronymFr}
                        {queries?.[index]?.acronymFr && ' - '}
                        {queries?.[index]?.shortName}
                        {queries?.[index]?.shortName && ' - '}
                        {queries?.[index]?.usualName}
                      </span>
                    </Link>
                  ) : (
                    <span>
                      {queries?.[index]?.acronymFr}
                      {queries?.[index]?.acronymFr && ' - '}
                      {queries?.[index]?.shortName}
                      {queries?.[index]?.shortName && ' - '}
                      {queries?.[index]?.usualName}
                    </span>
                  )}
                </Col>
                <Col n="1">
                  {response?.data?.id}
                </Col>
                <Col n="3">
                  {response?.statusText}
                </Col>
                <Col n="3">
                  {parents?.[index]?.status || ' x '}
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
