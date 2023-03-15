import {
  Accordion,
  AccordionItem,
  Alert,
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

import { capitalize } from '../utils/strings';
import { Spinner } from '../components/spinner';
import api from '../utils/api';
import FormFooter from '../components/forms/form-footer';
import useForm from '../hooks/useForm';
import {
  cleanStructureData,
  cleanSocialMediasData,
  cleanStructureNameData,
  cleanIdentifiersData,
  cleanWeblinks,
} from '../components/import/utils';

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
  const [responses, setResponses] = useState([]);
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
          // categories: objectItem[JSON.stringify('Code de la/des catégories {rechercher le code, séparation ;}')]?.split(';'),
          categories:
            objectItem[
              'Code de la/des catégories {rechercher le code, séparation ;}'
            ]?.split(';'),
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

    const checkName = async (name, siret, index) => {
      if (!name || name === undefined) {
        return {
          id: null,
          index,
          name,
          newWarnings: [{ message: "Le nom n'est pas renseigné" }],
        };
      }
      const potentialDuplicates = await api.get(
        `/autocomplete?types=structures&query=${name}`,
      );
      const duplicatedStructureId = potentialDuplicates.data.data.find(
        (el) => el.name === name,
      )?.id;
      const potentialDuplicatedSiret = await api.get(
        `/autocomplete?types=structures&query=${siret}`,
      );
      const duplicatedSiret = potentialDuplicatedSiret.data.data.find(
        (el) => el.identifiers,
      );

      const newWarnings = [];

      const findMultipleImport = structuresJson.filter((el) => el.usualName === name).length > 1;

      if (duplicatedSiret) {
        newWarnings.push({ message: `Le siret ${siret} existe déjà` });
      }

      if (duplicatedStructureId) {
        newWarnings.push({ message: `${name} est probablement un doublon` });
      }
      if (findMultipleImport) {
        newWarnings.push({ message: `${name} est présent plusieurs fois dans le tableau d'import` });
      }

      return {
        id: duplicatedStructureId,
        index,
        name,
        newWarnings,
        siret: duplicatedSiret,
      };
    };
    const namePromises = structuresJson.map((element, index) => checkName(element.usualName, element.siret, index));
    const results = await Promise.all(namePromises);
    const allResults = structuresJson.map((structure, index) => {
      const result = results.find((r) => r.index === index);
      return {
        ...structure,
        duplicatedStructureId: result?.id,
        index,
        newWarnings: result?.newWarnings,
      };
    });
    setWarnings(allResults.filter((el) => el?.newWarnings?.length > 0));
    setReadyToImport(allResults.filter((el) => el?.newWarnings?.length === 0));
    setIsLoading(false);
  };

  const saveStructure = async (structure) => {
    try {
      const saveResponse = await api.post(
        '/structures',
        cleanStructureData(structure),
      );
      const responseWithIndex = { ...saveResponse, index: structure.index };
      const newStructureId = saveResponse.data.id;
      const promises = [];

      const structureSocialMedia = cleanSocialMediasData(structure);
      const promisesSocialMedias = Object.keys(structureSocialMedia).map(
        (key) => api.post(`/structures/${newStructureId}/social-medias`, {
          type: key,
          account: structureSocialMedia[key],
        }),
      );
      if (promisesSocialMedias.length > 0) {
        const socialMediasResponses = await Promise.all(promisesSocialMedias);
        // Je dois probablement utiliser cette variable plus tard ?
      }

      const structureWeblinks = cleanWeblinks(structure);
      const promisesWeblinks = Object.keys(structureWeblinks).map((key) => {
        const weblink = structureWeblinks[key];
        return api.post(`/structures/${newStructureId}/weblinks`, weblink);
      });
      if (promisesWeblinks.length) {
        const weblinksResponses = await Promise.all(promisesWeblinks);
        // Je dois probablement utiliser cette variable plus tard ?
      }

      const { usualName, ...otherProperties } = cleanStructureNameData(structure);
      const newStructureName = { ...otherProperties };
      const nameResponse = await api.post(`/structures/${newStructureId}/names`, {
        ...newStructureName,
        usualName,
      });
        // Je dois probablement utiliser cette variable plus tard

      const structureIdentifiers = cleanIdentifiersData(structure);
      const promisesStructureIdentifiers = Object.keys(
        structureIdentifiers,
      ).map((key) => {
        const value = structureIdentifiers[key];
        return api.post(`/structures/${newStructureId}/identifiers`, {
          type: key,
          value,
        });
      });
      if (promisesStructureIdentifiers.length > 0) {
        const identifiersResponses = await Promise.all(promisesStructureIdentifiers);
        // Je dois probablement utiliser cette variable plus tard ?
      }

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
          if (categoryId !== '') {
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
        index: structure?.index,
        usualName: structure.usualName,
      };
      setResponsesErrors((responseFromApi) => [
        ...responseFromApi,
        responseWithIndex,
      ]);
      return error;
    }
  };
  const handleUploadClick = async () => {
    setIsLoading(true);
    const responsesPromises = readyToImport.map((structure) => saveStructure(structure));
    const newResponses = await Promise.all(responsesPromises);
    const allResponses = [
      ...feedBack,
      ...newResponses.filter((el) => el?.data?.id),
    ];
    setFeedBack(allResponses);
    updateForm({ data: '' });
    setResponses((oldResponses) => [
      ...oldResponses,
      ...newResponses,
      ...readyToImport,
      ...allResponses,
      ...responsesErrors,
    ]);
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
    setResponses([]);
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
      {isLoading && (
        <Row className="fr-my-2w flex--space-around">
          <Spinner />
        </Row>
      )}
      {warnings?.length > 0 && (
        <Row gutters>
          <Col n="12">
            <Col n="12">
              <Alert
                description={
                  warnings.length > 1
                    ? `Il y a ${warnings?.length} warnings`
                    : 'Il y a un warning'
                }
                title="Warning"
                type="warning"
              />
            </Col>
            <Accordion>
              <AccordionItem
                title={
                  warnings.length === 1
                    ? 'Voir le warning'
                    : `Voir les ${warnings.length} warnings`
                }
              >
                <Col n="12">
                  <Row gutters key="headers">
                    <Col n="1">Ligne</Col>
                    <Col n="3">Nom de la structure</Col>
                    <Col n="4">Warnings</Col>
                  </Row>
                  {warnings?.map(
                    (response, index) => response?.newWarnings?.length > 0 && (
                      <Row gutters key={index}>
                        <Col n="1">{response.index + 2}</Col>
                        <Col n="3">
                          <span>{response?.usualName}</span>
                          {response?.duplicatedStructureId && (
                            <Col>
                              <Link
                                target="_blank"
                                href={`/structures/${response?.duplicatedStructureId}`}
                              >
                                Vérifiez
                              </Link>
                            </Col>
                          )}
                        </Col>
                        <Col n="4">
                          <span>
                            {response?.newWarnings?.map((warning, i) => {
                              const isLast = i === response.newWarnings.length - 1;
                              const hasMultipleWarnings = response.newWarnings.length > 1;
                              const separator = !isLast && (hasMultipleWarnings ? ', ' : ' ');
                              const conjunction = i === response.newWarnings.length - 2
                                  && hasMultipleWarnings
                                ? ' et '
                                : '';
                              return (
                                <>
                                  {warning?.message}
                                  {separator}
                                  {conjunction}
                                </>
                              );
                            })}
                          </span>
                        </Col>
                        <Col>
                          <Button
                            colors={['#f55', '#fff']}
                            onClick={async () => {
                              try {
                                const saveResponse = await saveStructure(
                                  response,
                                );
                                warnings.splice(index, 1);
                                setResponses([...responses, saveResponse]);
                              } catch (error) {
                                // console.error(error);
                              }
                            }}
                            size="sm"
                          >
                            Forcer l'ajout de cet élément
                          </Button>
                        </Col>
                      </Row>
                    ),
                  )}
                </Col>
              </AccordionItem>
            </Accordion>
          </Col>
        </Row>
      )}
      {readyToImport?.length > 0 && (
        <Row gutters>
          <Col n="12">
            <Col n="12">
              <Alert
                description={
                  readyToImport.length > 1
                    ? `Il y a ${readyToImport?.length} structures qui sont prêtes à être ajoutées`
                    : 'Il y a une structure qui est prête à être ajoutée'
                }
                title="Validation"
                type="info"
              />
            </Col>
            <Accordion>
              <AccordionItem
                title={
                  readyToImport.length === 1
                    ? "Voir et valider l'import de cette structure"
                    : `Voir et valider l'import des ${readyToImport.length} prêtes à être importées`
                }
              >
                <Col n="12">
                  <Row gutters key="headers">
                    <Col n="1">Ligne</Col>
                    <Col n="2">Nom de la structure</Col>
                    <Col n="1">Statut</Col>
                    <Col n="2">Siret</Col>
                    <Col n="2">Twitter</Col>
                    <Col n="1">Parent</Col>
                    <Col n="1">Catégorie</Col>
                  </Row>
                  {readyToImport
                    ?.sort((a, b) => a.index - b.index)
                    .map((response, index) => (
                      <Row gutters key={index}>
                        <Col n="1">{response.index + 2}</Col>
                        <Col n="2">{response?.usualName}</Col>
                        <Col n="1">{response?.structureStatus}</Col>
                        {response?.siret ? (
                          <Col n="2">{response?.siret}</Col>
                        ) : (
                          <Col n="2"> </Col>
                        )}
                        {response?.twitter ? (
                          <Col n="2">
                            {response?.twitter.replace('https://', '')}
                          </Col>
                        ) : (
                          <Col n="2"> </Col>
                        )}
                        {response?.parent ? (
                          <Col n="1">
                            <Link
                              target="_blank"
                              href={`/structures/${response?.parent}`}
                            >
                              {response?.parent}
                            </Link>
                          </Col>
                        ) : (
                          <Col n="1"> </Col>
                        )}
                        {response?.categories[0] ? (
                          <Col n="1">
                            <Link
                              target="_blank"
                              href={`/categories/${response?.categories[0]}`}
                            >
                              {response?.categories[0]}
                            </Link>
                          </Col>
                        ) : (
                          <Col n="1"> </Col>
                        )}
                      </Row>
                    ))}
                  <FormFooter
                    buttonLabel={
                      readyToImport.length === 1
                        ? 'Importer cette structure'
                        : `Importer ces ${readyToImport.length} structures`
                    }
                    onSaveHandler={() => handleUploadClick()}
                  />
                </Col>
              </AccordionItem>
            </Accordion>
          </Col>
        </Row>
      )}
      {!!feedBack.length && (
        <Row gutters>
          <Col n="12">
            <Col n="12">
              <Alert
                description={
                  feedBack?.length > 1
                    ? `Il y a ${feedBack?.length} structures qui ont été importées`
                    : 'Il y a une structure qui a été importée'
                }
                title="Feedback"
                type="success"
              />
            </Col>
            <Accordion>
              <AccordionItem title="Voir les structures qui ont été importées">
                <Row gutters>
                  <Col n="1">Ligne</Col>
                  <Col n="3">Acronyme - Nom</Col>
                  <Col n="2">Id Paysage</Col>
                  <Col n="1">Message</Col>
                  <Col n="1">Parent</Col>
                  <Col n="3">Catégorie</Col>
                </Row>
                {feedBack
                  .sort((a, b) => a.index - b.index)
                  .map((response, index) => (
                    <Row gutters key={index}>
                      <Col n="1">{response.index + 2}</Col>
                      <Col n="3">
                        <span>
                          {response?.data?.acronymFr}
                          {response?.data?.acronymFr && ' - '}
                          {response?.data?.shortName}
                          {response?.data?.shortName && ' - '}
                          {response?.data?.currentName?.usualName}
                        </span>
                      </Col>
                      <Col n="2">
                        <Link
                          target="_blank"
                          href={`/structures/${response?.data?.id}`}
                        >
                          {response?.data?.id}
                        </Link>
                      </Col>
                      <Col n="1">Structure ajoutée</Col>
                      {response['structure-interne'] ? (
                        <Col n="1">
                          <Link
                            target="_blank"
                            href={`/structures/${response['structure-interne']?.resourceId}`}
                          >
                            {response['structure-interne']?.resourceId}
                          </Link>
                        </Col>
                      ) : (
                        <Col n="1"> </Col>
                      )}
                      {response['structure-categorie'] ? (
                        <Col n="3">
                          <Link
                            target="_blank"
                            href={`/categories/${response['structure-categorie']?.relatedObject?.id}`}
                          >
                            {
                              response['structure-categorie']?.relatedObject
                                ?.usualNameFr
                            }
                            (
                            {response['structure-categorie']?.relatedObject?.id}
                            )
                          </Link>
                        </Col>
                      ) : (
                        <Col n="3"> </Col>
                      )}
                    </Row>
                  ))}
              </AccordionItem>
            </Accordion>
          </Col>
        </Row>
      )}
      {!!responsesErrors.length && (
        <Row gutters>
          <Col n="12">
            <Col n="12">
              <Alert
                description={
                  responsesErrors?.length > 1
                    ? `Il y a ${responsesErrors?.length} imports qui ont été échoués`
                    : 'Il y a un import qui a échoué'
                }
                title="Erreur(s)"
                type="error"
              />
            </Col>
            <Accordion>
              <AccordionItem
                title={
                  responsesErrors.length === 1
                    ? "Voir l'import qui a echoué"
                    : `Voir les ${responsesErrors.length} qui ont échoués`
                }
              >
                <Row gutters>
                  <Col n="1">Ligne</Col>
                  <Col n="3">Acronyme - Nom</Col>
                  <Col n="5">Message</Col>
                  <Col n="3">Statut</Col>
                </Row>
                {responsesErrors.map((response, index) => (
                  <Row gutters key={index}>
                    <Col n="1">{response.index + 2}</Col>
                    <Col n="3">{response?.usualName}</Col>
                    <Col n="5">
                      {response?.statusText?.includes('usualName')
                        ? "La structure que vous souhaitez ajouter n'a pas de nom"
                        : null}
                      {response?.statusText?.includes('should match pattern')
                        ? 'Certains caractères ne sont pas acceptés'
                        : null}
                      {response?.statusText?.includes('does not exist')
                        ? "L'objet à lier n'existe pas"
                        : null}
                    </Col>
                    <Col n="3">{response.status}</Col>
                  </Row>
                ))}
              </AccordionItem>
            </Accordion>
          </Col>
        </Row>
      )}
      {!!feedBack.length && (
        <Button onClick={handleResetClick}>Refaire des imports</Button>
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
