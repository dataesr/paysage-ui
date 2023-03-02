import PropTypes from 'prop-types';
import { Col, Container, Icon, Row, Tile, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/search-bar';
import useSearch from '../hooks/useSearch';
import api from '../utils/api';
import { SEARCH_TYPES } from '../utils/constants';
import { toString } from '../utils/dates';
import { getRelatedObjectName } from '../utils/parse-related-element';
import useDebounce from '../hooks/useDebounce';
import { CATEGORIE_PARENT } from '../utils/relations-tags';
import KeyValueCard from '../components/card/key-value-card';
import { capitalize } from '../utils/strings';
import usePageTitle from '../hooks/usePageTitle';

const MAX_LAST_CREATIONS_CARDS = 12;
const DATE7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
// const DATE30 = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

const icons = {
  structures: 'ri-building-line',
  persons: 'ri-user-3-line',
  categories: 'ri-price-tag-3-line',
  terms: 'ri-hashtag',
  prizes: 'ri-award-line',
  projects: 'ri-booklet-line',
  officialtexts: 'ri-git-repository-line',
};

function Card({ item }) {
  const displayName = getRelatedObjectName(item);
  const { createdBy: user = {} } = item;
  return (
    <Col n="12 lg-4" as="li" key={item.id}>
      <Tile horizontal color={`var(--${item.collection}-color)`}>
        <div className="fr-tile__body">
          <p className="fr-tile__title">
            <Link className="fr-tile__link fr-link--md" to={`/${item.collection}/${item.id}`}>
              <Icon name={icons[item.collection]} size="1x" color={`var(--${item.collection}-color)`} />
              {displayName}
            </Link>
          </p>
          <p className="fr-pl-3w fr-tile__desc fr-text--xs">
            Créé le
            {' '}
            {toString(item.createdAt, true)}
            {' par '}
            {`${user.firstName} ${user.lastName}`.trim()}
          </p>
        </div>
      </Tile>
    </Col>
  );
}
Card.propTypes = {
  item: PropTypes.object.isRequired,
};

function CardCategoriesEtablissement({ item }) {
  return (
    <Col n="12 lg-4" as="li" key={item.id}>
      <Tile horizontal color={`var(--${item.collection}-color)`}>
        <div className="fr-tile__body">
          <p className="fr-tile__title">
            <Link className="fr-tile__link fr-link--md" to={`${item.href}/elements-lies`}>
              <Icon name={icons[item.collection]} size="1x" color={`var(--${item.collection}-color)`} />
              {item.displayName}
            </Link>
          </p>
        </div>
      </Tile>
    </Col>
  );
}
CardCategoriesEtablissement.propTypes = {
  item: PropTypes.object.isRequired,
};

const fetchLastCreationsWithMetrics = async (collection, { signal }) => {
  const params = `filters[createdAt][$gte]=${DATE7}&limit=10`;
  const response = await api
    .get(`/${collection}?${params}`, {}, { signal })
    .catch(() => ({ ok: false }));
  if (response.ok) {
    const data = response.data?.data?.map((element) => ({ ...element, collection }));
    const metric = { [collection]: response?.data?.totalCount };
    return { data, metric };
  }
  return { data: [], metric: {} };
};

function useFetchLastCreations() {
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    const collections = ['structures', 'persons', 'prizes', 'official-texts', 'categories', 'terms'];
    const getLastCreationsData = async () => {
      const fetchedData = await Promise.all(collections.map((collection) => fetchLastCreationsWithMetrics(collection, { signal: abortController.signal })));
      setData(fetchedData.map((result) => result.data).flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setMetrics(fetchedData.map((result) => result.metric).reduce((result, current) => ({ ...result, ...current }), {}));
    };
    getLastCreationsData();
    return () => abortController.abort();
  }, []);

  return [data, metrics];
}

function useFetchCounts() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const getCounts = async () => api
      .get('/metadata/counts', {}, { signal: abortController.signal })
      .then((response) => setCounts(response.data))
      .catch(() => setError(true));

    getCounts();
    return () => abortController.abort();
  }, []);

  return { counts, error, isLoading: (!counts && !error) };
}

function useFetchMostImportantCategories() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const getMostImportantCategories = async () => {
      const categories = await api
        .get(`/relations?filters[relatedObjectId]=j7jS2&filters[relationTag]=${CATEGORIE_PARENT}&sort=resource.priority`, {}, { signal: abortController.signal })
        .then((response) => response?.data?.data?.map((element) => ({ ...element.resource, collection: 'categories' })))
        .catch(() => []);
      setData(categories);
    };
    getMostImportantCategories();
    return () => abortController.abort();
  }, []);

  return data;
}

const objectMapping = {
  structures: 'structures',
  categories: 'catégories',
  prizes: 'prix',
  terms: 'termes',
  officialtexts: 'textes officiels',
  persons: 'personnes',
  projects: 'projets',
};

export default function HomePage() {
  const navigate = useNavigate();
  usePageTitle('Accueil');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [lastCreations, metrics] = useFetchLastCreations();
  const mostImportantCategories = useFetchMostImportantCategories();
  const { counts, isLoading } = useFetchCounts();
  // const { data } = useFetch(`/follow-ups?filters[eventDate][$gte]=${DATE30}&sort=-eventDate&limit=5`);
  // const { data: press } = useFetch(`/press?filters[publicationDate][$gte]=${DATE7.slice(0, 10)}&sort=-publicationDate&limit=4`);
  // TODO: Restore projects
  if (counts) delete counts.projects;
  const { data: options } = useSearch(SEARCH_TYPES, debouncedQuery);

  const handleSearchRedirection = ({ id, type }) => navigate(`/${type}/${id}`);
  const handleSearch = () => navigate(`rechercher?query=${query}`);
  const cardsToPrint = (lastCreations?.length > MAX_LAST_CREATIONS_CARDS) ? lastCreations.slice(0, MAX_LAST_CREATIONS_CARDS) : lastCreations;
  return (
    <Container fluid>
      {(!isLoading) && (
        <>
          <Container fluid className="search-bg" spacing="py-5w mb-4w">
            <Container>
              <Row>
                <Title as="h2">
                  Paysage de l'ESR
                </Title>
              </Row>
              <Row className="fr-pb-10w">
                <SearchBar
                  size="lg"
                  buttonLabel="Rechercher"
                  value={query}
                  placeholder="Rechercher..."
                  onChange={(e) => setQuery(e.target.value)}
                  options={options || []}
                  optionsIcon="ri-arrow-right-line"
                  onSearch={handleSearch}
                  onSelect={handleSearchRedirection}
                  isSearching={false}
                  className="fullwidth"
                />
              </Row>
              {(counts && Object.keys(counts)?.length > 0) && (
                <>
                  <Row>
                    <Title as="h3" look="h5" spacing="mb-0">
                      <Icon name="ri-dashboard-3-line" size="1x" />
                      Métriques
                    </Title>
                  </Row>
                  <Row gutters spacing="mb-2w">
                    {Object.keys(counts).map((k) => (
                      <Col key={k} n="4 sm-4 md-4">
                        <KeyValueCard
                          cardKey={capitalize(objectMapping[k])}
                          cardValue={`${counts[k]}`}
                          className={`card-${k} card--border-bottom`}
                          icon={icons[k]}
                          linkTo={`./rechercher/${objectMapping[k]}?query=&page=1`}
                          tooltip={`+ ${metrics[k]} sur les 7 derniers jours`}
                        />
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Container>
          </Container>
          <Container spacing="mb-8w">
            {(lastCreations && (lastCreations.length > 0)) && (
              <>
                <Row>
                  <Title as="h2">
                    <Icon name="ri-flashlight-line" size="1x" />
                    Derniers ajouts
                  </Title>
                </Row>
                <Row gutters className="fr-pb-8w">
                  {cardsToPrint.map((element) => <Card key={element.id} item={element} />)}
                </Row>
              </>
            )}
            {(mostImportantCategories?.length > 0) && (
              <>
                <Row>
                  <Title as="h2">
                    <Icon name="ri-file-list-3-line" size="1x" />
                    Listes d'établissements
                  </Title>
                </Row>
                <Row gutters>
                  {mostImportantCategories.map((element) => <CardCategoriesEtablissement key={element.id} item={element} />)}
                </Row>
              </>
            )}
          </Container>
          {/* <Container spacing="mb-8w">
            <Row gutters>
              <Col n="6">
                {(data?.data?.length > 0) && (
                  <>
                    <Row>
                      <Title as="h2">
                        <Icon name="ri-flashlight-line" size="1x" />
                        Évenements récents
                      </Title>
                    </Row>
                    <Timeline>
                      {data.data.map((event) => (
                        <TimelineItem date={event.eventDate} key={event.id}>
                          <Text spacing="mb-1w" bold>{event.title}</Text>
                          {event.description && <Text size="xs" spacing="mb-1w">{event.description}</Text>}
                          {event.relatedObjects && (
                            <TagList>
                              {event.relatedObjects.map(
                                (related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                              )}
                            </TagList>
                          )}
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </>
                )}
              </Col>
              <Col n="6">
                {(press?.data?.length > 0) && (
                  <>
                    <Row>
                      <Title as="h2">
                        <Icon name="ri-flashlight-line" size="1x" />
                        Dernières actualités
                      </Title>
                    </Row>
                    <Row gutters>
                      {press.data.map((event) => (
                        <Col n="12">
                          <div className="fr-card fr-card--xs fr-card--shadow">
                            <div className="fr-card__body">
                              <div className="fr-card__content">
                                <div className="fr-card__start">
                                  <Row className="flex--space-between">
                                    <BadgeGroup>
                                      <Badge type="new" text={event?.publicationDate} />
                                      {event?.sourceName && <Badge text={event?.sourceName} />}
                                    </BadgeGroup>
                                  </Row>
                                </div>
                                <p className="fr-card__title fr-text--md fr-mb-0">
                                  {event?.title}
                                  <Button title="Voir la dépeche" onClick={() => { window.open(event?.sourceUrl, '_blank'); }} rounded borderless icon="ri-external-link-line" />
                                </p>
                                {event?.summary && <div className="fr-card__desc fr-mt-0">{`${event.summary.substring(0, 100)}...`}</div>}
                                <div className="fr-card__end">
                                  {(event?.relatedObjects.length > 1) && <Text spacing="mb-1w" bold>Autres objets associés :</Text>}
                                  {event?.relatedObjects && (
                                    <TagList>
                                      {event?.relatedObjects.map(
                                        (related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                                      )}
                                    </TagList>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </Container> */}
        </>
      )}
    </Container>
  );
}
