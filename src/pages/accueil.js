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
import { getRelatedObjectName, getRelatedObjectUrl } from '../utils/parse-related-element';
import useDebounce from '../hooks/useDebounce';

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
  const href = getRelatedObjectUrl(item);
  const { createdBy: user } = item;
  return (
    <Col n="12 lg-4" as="li" key={item.id}>
      <Tile horizontal color={`var(--${item.collection}-color)`}>
        <div className="fr-tile__body">
          <p className="fr-tile__title">
            <Link className="fr-tile__link fr-link--md" to={href}>
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

const fetchLastCreations = async (collection, { signal }) => {
  const params = 'sort=createdAt&limit=10';
  const response = await api
    .get(`/${collection}?${params}`, {}, { signal })
    .catch(() => ({ ok: false }));
  if (response.ok) {
    const data = response.data?.data?.map((element) => ({ ...element, collection }));
    return data;
  }
  return [];
};

function useFetchLastCreations() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const collections = ['structures', 'categories', 'persons', 'prices', 'terms', 'official-texts', 'projects'];
    const getLastCreationsData = async () => {
      const fetchedData = await Promise.all(collections.map((collection) => fetchLastCreations(collection, { signal: abortController.signal })));
      setData(fetchedData.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };
    getLastCreationsData();
    return () => abortController.abort();
  }, []);

  return data;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const data = useFetchLastCreations();
  const { data: options } = useSearch(SEARCH_TYPES, debouncedQuery);
  useEffect(() => { document.title = 'Paysage · Accueil'; }, []);

  const handleSearchRedirection = ({ id, type }) => navigate(`/${type}/${id}`);
  const handleSearch = () => navigate(`rechercher?query=${query}`);

  const cardsToPrint = (data?.length > MAX_LAST_CREATIONS_CARDS) ? data.slice(0, MAX_LAST_CREATIONS_CARDS) : data;
  return (
    <Container spacing="mt-5w" as="main">
      <Row className="fr-pb-5w">
        <Title as="h2">Paysage de l'ESR</Title>
      </Row>
      <Row className="fr-pb-5w">
        <SearchBar
          size="lg"
          buttonLabel="Rechercher"
          value={query}
          label="Rechercher dans Paysage"
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
      {(data?.length) ? (
        <>
          <Row className="fr-pb-5w">
            <Title as="h2">Derniers ajouts</Title>
          </Row>
          <Row gutters className="fr-pb-5w">
            {cardsToPrint.map((element) => <Card key={element.id} item={element} />)}
          </Row>
        </>
      ) : <PageSpinner />}
    </Container>
  );
}
