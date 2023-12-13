import { Badge, Button, Col, Container, Icon, Link, Row, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import Map from '../../../components/map/geographical-categories-map';
import { ExceptionStructuresList, StructuresList } from './structuresList';
import { capitalize } from '../../../utils/strings';
import { GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER } from '../../../utils/constants';
import GroupsCard from '../../../components/card/groups-card';
import IdentifierCard from '../../../components/card/geo-identifiers-card';
import WikipediaLinks from '../../../components/card/wiki-card-geographical';

function ExternalStructures({ exceptionGps }) {
  return (
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
  );
}

export default function GeographicalCategoryPresentationPage() {
  const { url, id } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  const originalId = data?.originalId;
  const wikidata = data?.wikidata;
  const limit = data?.nameFr === 'France' ? 2000 : 10000;
  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures?limit=${limit}`);

  const [wikiInfo, setWikiInfo] = useState(null);
  const [visibleCards, setVisibleCards] = useState(5);

  const showMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 5);
  };

  useEffect(() => {
    const fetchWikipediaInfo = async () => {
      if (wikidata) {
        const wikidataId = wikidata;
        try {
          const response = await fetch(`https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&ids=${wikidataId}`);
          const result = await response.json();
          const frenchDescription = result.entities[wikidataId]?.descriptions?.fr?.value;
          const itemName = result.entities[wikidataId]?.labels;
          if (frenchDescription) {
            setWikiInfo({
              description: frenchDescription,
              itemName,
            });
          } else {
            // eslint-disable-next-line no-console
            console.error('La description en français est introuvable.');
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Erreur lors de la récupération des données de Wikipédia', err);
        }
      }
    };

    fetchWikipediaInfo();
  }, [wikidata]);

  const allowedLanguages = ['fr', 'en', 'es', 'de', 'ru', 'zh', 'it'];

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
    markers = dataStructures.data
      .filter((item) => item.currentLocalisation && item.currentLocalisation.active === true)
      .map((item) => ({
        idStructure: item.id,
        label: item.currentName.usualName,
        latLng: item.currentLocalisation?.geometry?.coordinates?.toReversed(),
        address: `{${item.currentLocalisation?.address || ''},
                ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}}`,
      }));
  }

  return (
    <Container fluid>
      <Title as="h2" look="h4">
        En un coup d'oeil
        <Icon className="ri-eye-2-line fr-ml-1w" />
      </Title>
      {data?.groups && (
        <Row>
          <Col>
            <GroupsCard groups={data?.groups} />
          </Col>
        </Row>
      ) }
      {wikiInfo && (
        <Row spacing="mb-3w mt-3w">
          <Col n="12 ">
            {wikiInfo && <WikipediaLinks wikiInfo={wikiInfo} allowedLanguages={allowedLanguages} />}
          </Col>
        </Row>
      )}
      {data?.parent && (
        <Row spacing="mb-3w">
          <Col n="4">
            <Link href={`/categories-geographiques/${data?.parent?.id}/presentation`}>
              <KeyValueCard
                titleAsText
                className="card-geographical-categories"
                cardKey="Catégorie géographique parente"
                cardValue={`${data?.parent?.nameFr} (${capitalize(GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[data.parent.level])})`}
                icon="ri-align-left"
              />
            </Link>
          </Col>
        </Row>
      )}
      {data?.children && (
        <Row spacing="mb-3w" gutters>
          {data?.children.slice(0, visibleCards).map((child) => (
            <Col key={child?.id} n="12 md-4">
              <Link href={`/categories-geographiques/${child?.id}/presentation`}>
                <KeyValueCard
                  titleAsText
                  className="card-geographical-categories"
                  cardKey="Catégorie géographique enfant"
                  cardValue={`${child?.nameFr} (${capitalize(GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[child?.level])})`}
                  icon="ri-align-left"
                />
              </Link>
            </Col>
          ))}
          <Col>
            {data.children.length > visibleCards && (
              <Button onClick={showMoreCards}>Afficher plus</Button>
            )}
          </Col>
        </Row>
      )}
      {data.nameFr !== 'France' && (

        <Col n="12">
          <div aria-hidden>
            <Map
              height="400px"
              markers={markers}
              polygonCoordinates={polygonCoordinates}
            />
          </div>
        </Col>
      )}

      <Row spacing="mt-5w">
        <Title as="h2" look="h4">
          Structures associées
          <Badge text={dataStructures?.totalCount} colorFamily="yellow-tournesol" />
        </Title>
        <Row spacing="mt-3w">
          <Col n="12">
            <StructuresList isLoading={isLoading} data={dataStructures?.data} id={id} wikidata={wikidata} />
          </Col>
        </Row>
      </Row>
      <Row spacing="mt-5w" gutters>
        <Col>
          <IdentifierCard wikidata={wikidata} originalId={originalId} />
        </Col>
      </Row>
      {exceptionGps.length > 0 && <ExternalStructures exceptionGps={exceptionGps} />}
    </Container>
  );
}

WikipediaLinks.propTypes = {
  wikiInfo: PropTypes.shape({
    description: PropTypes.string.isRequired,
    itemName: PropTypes.object.isRequired,
  }),
  allowedLanguages: PropTypes.array,
};

WikipediaLinks.defaultProps = {
  wikiInfo: {
    description: '',
    itemName: {},
  },
  allowedLanguages: [],
};

ExternalStructures.propTypes = {
  exceptionGps: PropTypes.array,
};

ExternalStructures.defaultProps = {
  exceptionGps: PropTypes.array,
};
