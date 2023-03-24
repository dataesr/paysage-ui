import {
  Button,
  Col,
  Container,
  Link,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Spinner } from '../components/spinner';

import { capitalize } from '../utils/strings';
import api from '../utils/api';
import useForm from '../hooks/useForm';
import WarningsDisplay from '../components/import/display-warnings';
import ErrorsDisplay from '../components/import/display-errors';
import FeedbackDisplay from '../components/import/display-feedback';
import ReadyToImport from '../components/import/display-ready-to-import';
import checkName from '../components/import/validate-structure-imput';

const LINE_SEPARATOR = '\n';
const TSV_SEPARATOR = '\t';

const statusMapping = {
  O: 'active',
  F: 'inactive',
  P: 'forthcoming',
};
const types = ['structures'];

function sanitize(form) {
  const fields = ['types', 'data'];
  const body = {};
  Object.keys(form).forEach((key) => {
    if (fields.includes(key)) {
      body[key] = form[key];
    }
  });
  return body;
}

export default function ImportPage({ data }) {
  const [boutonVisible, setBoutonVisible] = useState(true);
  const [readyToImport, setReadyToImport] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [feedBack, setFeedBack] = useState([]);
  const [responsesErrors, setResponsesErrors] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { form, updateForm } = useForm(data);

  const checkUploadOnClick = async () => {
    setIsLoading(true);
    const structuresTsv = JSON.parse(JSON.stringify(form.data)).split(
      LINE_SEPARATOR,
    );
    const headers = structuresTsv.shift().split(TSV_SEPARATOR);
    const structuresJson = structuresTsv
      .filter((item) => item.length)
      .map((item) => {
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
          acronymLocal:
            objectItem['Nom court officiel dans la langue originale'],
          otherNames:
            objectItem[
              'Autres dénominations possibles séparées par des ;'
            ]?.split(';'),
          structureStatus:
            statusMapping[
              objectItem['Statut [O = Ouvert, F = Fermé, P = Potentiel]']
            ],
          categories: objectItem['Code de la/des catégories {rechercher le code, séparation ;}']?.split(';').filter((category) => category !== ''),
          legalCategory:
            objectItem['Code du statut juridique {rechercher le code}'],
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
          linkedIn:
            objectItem[
              'Compte linkedIn [https://www.linkedin.com/in/XXX-XXX-123456/]'
            ],
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
        if (
          objectItem?.[
            "Localisation [A1 = France métropolitaine et les DOM, A2 = Collectivités d'outre-mer, A3 = Hors de France]"
          ] !== 'A3'
        ) {
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

    const namePromises = structuresJson.map((element, index) => checkName(element.usualName, element.siret, index, structuresJson));
    const results = await Promise.all(namePromises);
    const allResults = structuresJson.map((structure, index) => {
      const result = results.find((r) => r.index === index);
      return {
        structure,
        duplicatedStructureId: result?.id,
        index,
        newWarnings: result?.newWarnings,
      };
    });
    setWarnings(allResults.filter((el) => el?.newWarnings?.length > 0));
    setReadyToImport(allResults.filter((el) => el?.newWarnings?.length === 0));
    setIsLoading(false);
  };
  const saveStructure = async (structure, index) => {
    try {
      const saveResponse = await api.post('/structures', structure);
      const responseWithIndex = { ...saveResponse, index };

      const newStructureId = saveResponse.data.id;
      const promises = [];

      if (structure.parent && newStructureId) {
        const parentPromise = api.post('/relations', {
          resourceId: structure.parent,
          relatedObjectId: newStructureId,
          relationTag: 'structure-interne',
        });
        promises.push(parentPromise);
      }
      if (
        structure.categories
        && structure.categories.length > 0
        && newStructureId
      ) {
        const categoryPromises = [];
        structure.categories.forEach((categoryId) => {
          if (categoryId && categoryId.trim() !== '') {
            categoryPromises.push(
              api.post('/relations', {
                resourceId: newStructureId,
                relatedObjectId: categoryId,
                relationTag: 'structure-categorie',
              }),
            );
          }
        });
        promises.push(...categoryPromises);
      }

      if (structure.legalCategory && newStructureId) {
        const legalCategoryPromises = [];
        if (typeof structure.legalCategory === 'string' && structure.legalCategory !== '') {
          legalCategoryPromises.push(
            api.post('/relations', {
              resourceId: newStructureId,
              relatedObjectId: structure.legalCategory,
              relationTag: 'structure-categorie-juridique',
            }),
          );
        }
        promises.push(...legalCategoryPromises);
      }

      if (promises.length > 0) {
        const Responses = await Promise.all(promises);
        Responses.forEach((response) => {
          responseWithIndex[response.data.relationTag] = response.data;
        });
      }
      setFeedBack([...feedBack, responseWithIndex]);
      return responseWithIndex;
    } catch (error) {
      const responseWithIndex = {
        status: error?.message,
        statusText: `${error?.error} : ${JSON.stringify(error?.details?.[0])}`,
        data: {},
        index,
        usualName: structure?.usualName,
      };
      setResponsesErrors((responseFromApi) => [
        ...responseFromApi,
        responseWithIndex,
      ]);
      return error;
    }
  };

  const handleForceImport = async (structure, index) => {
    setIsLoading(true);
    await saveStructure(structure, index);
    setWarnings(warnings.filter((warning, i) => i !== index));
    setIsLoading(false);
  };

  const handleUploadClick = async () => {
    setIsLoading(true);
    const responsesPromises = readyToImport.map(({ structure, index }) => saveStructure(structure, index));
    const newResponses = await Promise.all(responsesPromises);
    const allResponses = [
      ...feedBack,
      ...newResponses.filter((el) => el?.data?.id),
    ];
    setFeedBack(allResponses);
    updateForm({ data: '' });
    setReadyToImport([]);
    setIsLoading(false);
  };
  const handleClick = () => {
    checkUploadOnClick(sanitize(form));
    setBoutonVisible(false);
  };

  const handleResetClick = () => {
    setFeedBack([]);
    setResponsesErrors([]);
    setReadyToImport([]);
    setWarnings([]);
    updateForm({ data: '' });
    setIsLoading(false);
    setBoutonVisible(true);
  };
  return (
    <Container spacing="py-6w">
      <Row gutters>
        <Col n="12">
          <form acceptCharset="UTF-8">
            <Select
              label="Objet Paysage"
              options={types.map((el) => ({
                label: capitalize(el),
                value: el,
              }))}
              selected={form?.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              required
            />
            <p>
              Récupérer le
              {' '}
              <Link href="/models/AjoutEnMasseStructure.xlsx">
                fichier modèle
              </Link>
              , le remplir (une ligne correspond à un élément), copier puis
              coller dans le champ ci-dessous les cellules correspondant aux
              éléments à ajouter.
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
                {boutonVisible && (
                  <Button onClick={handleClick}>Vérification</Button>
                )}
                {' '}
              </Col>
              {form?.data?.length > 0 && (
                <Col>
                  <Button
                    colors={['#f55', '#fff']}
                    onClick={() => updateForm({ data: '' }, setBoutonVisible(true))}
                  >
                    Effacer
                  </Button>
                </Col>
              )}
            </Row>
          </form>
        </Col>
      </Row>
      {isLoading && (
        <Row className="fr-my-2w flex--space-around">
          <Spinner />
        </Row>
      ) }

      {(!!warnings.length
      && <WarningsDisplay warnings={warnings} handleForceImport={handleForceImport} isLoading={isLoading} />
      )}
      {readyToImport?.length > 0
      && (
        <ReadyToImport readyToImport={readyToImport} handleUploadClick={handleUploadClick} />
      )}
      {!!feedBack.length
      && (
        <FeedbackDisplay feedBack={feedBack} />
      )}
      <ErrorsDisplay responsesErrors={responsesErrors} />

      <Row gutters>
        {!!feedBack.length > 0 || !!warnings.length > 0 || !!readyToImport.length > 0 || !!responsesErrors.length > 0 ? (
          <Col>
            <Button onClick={handleResetClick}>Reinitialiser les imports</Button>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
}

ImportPage.propTypes = {
  data: PropTypes.object,
};

ImportPage.defaultProps = {
  data: {},
};
