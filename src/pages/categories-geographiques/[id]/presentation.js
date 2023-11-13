import { Badge, Col, Icon, Link, Row, Tag, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import Map from '../../../components/map/geographical-categories-map';
import { ExceptionStructuresList } from './structuresList';
import getLink from '../../../utils/get-links';
import TagList from '../../../components/tag-list';
import { capitalize } from '../../../utils/strings';
import { GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER } from '../../../utils/constants';

function WikipediaLinks({ wikiInfo, allowedLanguages }) {
  return (
    <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-geographical-categories">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-card__start">
            <p className="fr-card__detail fr-text--sm fr-mb-2">
              <Icon name="ri-global-line" size="1x" />
              Dans Wikipédia
            </p>
            <p>{capitalize(wikiInfo.description)}</p>
            <TagList>
              {Object.keys(wikiInfo.itemName).map((lang) => {
                if (allowedLanguages.includes(lang)) {
                  const langInfo = wikiInfo.itemName[lang];
                  if (langInfo.value) {
                    const wikipediaUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(langInfo.value)}`;
                    return (
                      <Tag
                        iconPosition="right"
                        icon="ri-external-link-line"
                        onClick={() => {
                          window.open(wikipediaUrl, '_blank');
                        }}
                        key={lang}
                      >
                        {lang.toLocaleUpperCase()}
                      </Tag>
                    );
                  }
                }
                return null;
              })}
            </TagList>
          </div>
        </div>
      </div>
    </div>
  );
}

function Identifiers({ wikidata }) {
  return (
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
  );
}

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
        <Col n="12 ">
          {wikiInfo && <WikipediaLinks wikiInfo={wikiInfo} allowedLanguages={allowedLanguages} />}
        </Col>
      </Row>
      {data.parent && (
        <Row spacing="mb-3w">
          <Col n="4">
            <Link href={`/categories-geographiques/${data?.parent?.id}/presentation`}>
              <KeyValueCard
                titleAsText
                className="card-geographical-categories"
                cardKey="Categorie géographique parente"
                cardValue={`${data?.parent?.nameFr} (${capitalize(GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[data.parent.level])})`}
                icon="ri-align-left"
              />
            </Link>
          </Col>
        </Row>
      )}
      <Col n="12">
        <Map
          height="800px"
          markers={markers}
          polygonCoordinates={polygonCoordinates}
        />
      </Col>
      {wikidata && <Identifiers wikidata={wikidata} />}
      {exceptionGps.length > 0 && <ExternalStructures exceptionGps={exceptionGps} />}
    </>
  );
}

WikipediaLinks.propTypes = {
  wikiInfo: PropTypes.isRequired,
  allowedLanguages: PropTypes.isRequired,
};

Identifiers.propTypes = {
  wikidata: PropTypes.isRequired,
};

ExternalStructures.propTypes = {
  exceptionGps: PropTypes.array,
};

ExternalStructures.defaultProps = {
  exceptionGps: PropTypes.array,
};
