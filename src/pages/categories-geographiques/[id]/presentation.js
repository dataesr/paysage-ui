import { Badge, Col, Icon, Row, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import Map from '../../../components/map/geographical-categories-map';
import {
  ExceptionStructuresList,
} from './structuresList';
import getLink from '../../../utils/get-links';

export default function GeographicalCategoryPresentationPage() {
  const { url, id } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  const wikidata = data?.wikidata;
  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures`);

  const [wikiInfo, setWikiInfo] = useState(null);

  useEffect(() => {
    const fetchWikipediaInfo = async () => {
      if (wikidata) {
        const wikidataId = wikidata;
        try {
          const response = await fetch(`https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&ids=${wikidataId}`);
          const result = await response.json();
          const frenchDescription = result.entities[wikidataId]?.descriptions?.fr?.value;
          if (frenchDescription) {
            setWikiInfo({
              description: frenchDescription,
            });
          } else {
            // console.error('La description en français est introuvable.');
          }
        } catch (err) {
          // console.error('Erreur lors de la récupération des données de Wikipédia', err);
        }
      }
    };

    fetchWikipediaInfo();
  }, [wikidata]);

  const exceptionGps = [];
  const exception = useFetch('/geographical-exceptions');

  if (exception?.data?.data) {
    const geographicalCategoryIds = exception.data.data.map((item) => item.geographicalCategoryId);
    if (geographicalCategoryIds.includes(id)) {
      const item = exception.data.data.find((el) => el.geographicalCategoryId === id);
      if (
        item.resource
        && item.resource.currentLocalisation
        && item.resource.currentLocalisation.geometry
        && item.resource.currentLocalisation.geometry.coordinates
      ) {
        exceptionGps.push({
          ...item,
        });
      }
    }
  }

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;

  const polygonCoordinates = data?.geometry;

  let markers = [];
  if (!structuresLoading && dataStructures?.data?.length > 0) {
    markers = dataStructures.data.map((item) => ({
      idStructure: item.id,
      label: item.currentName.usualName,
      latLng: item.currentLocalisation?.geometry?.coordinates?.toReversed(),
      address: `{${item.currentLocalisation?.address || ''},
                ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}}`,
    }));
  }

  return (
    <>
      <Row spacing="mb-3w">
        <Col n="12 md-6 mt-2">
          {wikiInfo && (
            <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-geographical-categories">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <div className="fr-card__start">
                    <p className="fr-card__detail fr-text--sm fr-mb-2">
                      <Icon name="ri-global-line" size="1x" />
                      Dans Wikipédia
                      {}
                    </p>
                    <p>{wikiInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <Col n="12">
        <Map
          height="800px"
          markers={markers}
          polygonCoordinates={polygonCoordinates}
        />
      </Col>
      {wikidata && (
        <>
          <Row className="fr-mt-3w">
            <Title as="h2" look="h4">
              Identifiants
            </Title>
          </Row>
          <Col n="12 md-3 ">
            <KeyValueCard
              cardKey="Wikidata"
              cardValue={wikidata}
              copy
              icon="ri-fingerprint-2-line"
              linkTo={getLink({ value: wikidata, type: 'wikidata' })}
            />
          </Col>
        </>
      )}
      {
        exceptionGps?.length > 0 && (
          <Row className="fr-mt-3w">
            <Col>
              <Title as="h2" look="h4">
                Autres structures associées en dehors du territoire
                <Badge
                  className="fr-ml-1w"
                  colorFamily="yellow-tournesol"
                  text={exceptionGps.length.toString() || '0'}
                />
              </Title>
              <Col>
                <ExceptionStructuresList exceptionGps={exceptionGps} />
              </Col>
            </Col>

          </Row>
        )
      }
    </>
  );
}
