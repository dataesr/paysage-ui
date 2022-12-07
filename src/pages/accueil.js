import PropTypes from 'prop-types';
import { Col, Container, Icon, Row, Tile, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/search-bar';
import { PageSpinner } from '../components/spinner';
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

const icons = {
  structures: 'ri-building-line',
  persons: 'ri-user-3-line',
  categories: 'ri-price-tag-3-line',
  terms: 'ri-hashtag',
  prices: 'ri-award-line',
  projects: 'ri-booklet-line',
  'official-texts': 'ri-git-repository-line',
};

function Card({ item }) {
  const displayName = getRelatedObjectName(item);
  const { createdBy: user } = item;
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
            Crée le
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
  const params = 'sort=createdAt&limit=10';
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
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    const collections = ['structures', 'persons', 'prices', 'official-texts', 'categories', 'terms'];
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
  prices: 'prix',
  terms: 'termes',
  'official-texts': 'textes officiels',
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
  const { data: options } = useSearch(SEARCH_TYPES, debouncedQuery);

  const handleSearchRedirection = ({ id, type }) => navigate(`/${type}/${id}`);
  const handleSearch = () => navigate(`rechercher?query=${query}`);
  const cardsToPrint = (lastCreations?.length > MAX_LAST_CREATIONS_CARDS) ? lastCreations.slice(0, MAX_LAST_CREATIONS_CARDS) : lastCreations;
  return (
    <Container fluid>
      <Container fluid className="search-bg" spacing="py-5w mb-4w">
        <Container>
          <Row>
            <Title as="h2">
              Paysage de l'ESR
            </Title>
          </Row>
          <Row className="fr-pb-4w">
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
          <Row>
            <Title as="h3" look="h5" spacing="mb-0">
              <Icon name="ri-dashboard-3-line" size="1x" />
              Métriques
            </Title>
          </Row>
          <Row gutters spacing="mb-2w">
            {(Object.keys(metrics)?.length > 0) ? (Object.keys(metrics).map((k) => (
              <Col key={k} n="6 sm-4 md-2">
                <KeyValueCard
                  cardKey={capitalize(objectMapping[k])}
                  cardValue={metrics[k]}
                  icon={icons[k]}
                  className={`card-${k} card--border-bottom`}
                />
              </Col>
            ))) : null}
          </Row>
        </Container>
      </Container>
      <Container>
        <Row>
          <Title as="h2">
            <Icon name="ri-flashlight-line" size="1x" />
            Derniers ajouts
          </Title>
        </Row>
        <Row gutters className="fr-pb-8w">
          {(lastCreations?.length) ? cardsToPrint.map((element) => <Card key={element.id} item={element} />) : <PageSpinner />}
        </Row>
        <Row>
          <Title as="h2">
            <Icon name="ri-file-list-3-line" size="1x" />
            Listes d'établissements
          </Title>
        </Row>
        <Row gutters className="fr-pb-8w">
          {(mostImportantCategories?.length) ? mostImportantCategories.map((element) => <CardCategoriesEtablissement key={element.id} item={element} />) : <PageSpinner />}
        </Row>
      </Container>
    </Container>
  );
}
