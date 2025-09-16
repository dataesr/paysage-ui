/* eslint-disable indent */
import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Icon, Pagination, Row, SideMenu, SideMenuLink, Text, Tile, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';

import { Spinner } from '../components/spinner';
import useSearch from '../hooks/useSearch';
import { formatDescriptionDates, toString } from '../utils/dates';
import { getName, getPrizeName } from '../utils/structures';
import { getTypeFromUrl, getUrlFromType } from '../utils/types-url-mapper';
import { SEARCH_TYPES, GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER } from '../utils/constants';
import usePageTitle from '../hooks/usePageTitle';

const icons = {
  structures: 'ri-building-line',
  persons: 'ri-user-3-line',
  categories: 'ri-price-tag-3-line',
  'geographical-categories': 'ri-global-line',
  terms: 'ri-hashtag',
  prizes: 'ri-award-line',
  projects: 'ri-booklet-line',
  'official-texts': 'ri-git-repository-line',
};

const getDescription = (item) => {
  const description = {
    category: '',
    location: '',
    creationDate: '',
    closureDate: '',
  };

  switch (item?.type) {
    case 'structures':
      description.category = item?.category || '';
      if (item?.city?.[0]) {
        description.location = `à ${item.city[0]}`;
      } else if (item?.locality?.[0]) {
        description.location = `à ${item.locality[0]}`;
      }

      if (item?.creationDate) {
        const parts = item.creationDate.split('-');
        if (parts.length === 3) {
          description.creationDate = `Créée le ${toString(item.creationDate)}`;
        } else if (parts.length === 2) {
          description.creationDate = `Créée en ${parts[1]}/${parts[0]}`;
        } else {
          description.creationDate = `Créée en ${parts[0]}`;
        }
      }
      if (item?.closureDate) {
        const parts = item.closureDate.split('-');
        if (parts.length === 3) {
          description.closureDate = `Fermée le ${toString(item.closureDate)}`;
        } else if (parts.length === 2) {
          description.closureDate = `Fermée en ${parts[1]}/${parts[0]}`;
        } else {
          description.closureDate = `Fermée en ${parts[0]}`;
        }
      }
      break;
    case 'persons':
      description.category = item.activity || '';
      break;

    case 'categories':
    case 'terms':
    case 'official-texts':
      break;

    case 'projects':
      description.category = item?.category || '';
      description.creationDate = item?.startDate ? `${formatDescriptionDates(item?.startDate)}` : '';
      break;

    case 'geographical-categories':
      if (item.level) {
        description.category = GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[item.level] || '';
        if (GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[item.level] === 'Unité urbaine') {
          description.category += ` (${item.originalId})`;
        }
      }
      break;

    default:
  }

  return description;
};

function SearchResults({ data }) {
  if (data && data.length) {
    return (
      <Row as="ul" gutters>
        {data.map((item) => {
          const { category, location, creationDate, closureDate } = getDescription(item);
          return (
            <Col n="12 lg-6" as="li" key={item.id}>
              <Tile horizontal color={`var(--${item.type}-color)`}>
                <div className="fr-tile__body">
                  <p className="fr-tile__title">
                    <RouterLink className="fr-tile__link fr-link--md" to={`/${getUrlFromType(item.type)}/${item.id}`}>
                      <Icon name={icons[item.type]} size="1x" color={`var(--${item.type}-color)`} />
                      {item.type === 'prizes' ? getPrizeName(item) : getName(item)}
                    </RouterLink>
                  </p>
                  {item.structureStatus === 'inactive' && (
                    <Badge
                      isSmall
                      colorFamily="brown-opera"
                      text="Inactive"
                      spacing="mb-0"
                    />
                  )}
                  <p className="fr-tile__desc">
                    {category && <span>{category}</span>}
                    {category && location && ' '}
                    {location}
                    {creationDate && (
                    <span>
                      <br />
                      {creationDate}
                    </span>
                    )}
                    {closureDate && (
                    <span>
                      <br />
                      {closureDate}
                    </span>
                    )}
                  </p>
                </div>
              </Tile>
            </Col>
          );
        })}
      </Row>
    );
  }
  return <p>Aucun résultat</p>;
}

SearchResults.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape),
};

SearchResults.defaultProps = {
  data: null,
};

export default function SearchPage() {
  usePageTitle('Rechercher');
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');
  const currentPage = searchParams.get('page') || 1;
  const itemsPerPage = 10;
  const start = itemsPerPage * (currentPage - 1);
  const pathnameSplitted = pathname.split('/');
  const type = pathnameSplitted[pathnameSplitted.length - 1];
  const { counts } = useSearch(SEARCH_TYPES, query, 0);
  const { data, error, isLoading } = useSearch(getTypeFromUrl(type) || SEARCH_TYPES, query, itemsPerPage, start);
  const countAll = Object.values(counts).reduce((accumulator, value) => accumulator + value, 0);
  const resultsCount = type === 'rechercher' ? countAll : (counts?.[getTypeFromUrl(type)] || 0);
  const resultsCountConstrained = (resultsCount > 10000) ? 10000 : resultsCount;
  const pageCount = Math.ceil(resultsCountConstrained / itemsPerPage);

  return (
    <Container spacing="pb-6w">
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>
          Accueil
        </BreadcrumbItem>
        <BreadcrumbItem>
          Rechercher
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Title as="h1" look="h5">
          Résultats pour la recherche
          {query?.length > 0 && (
            ` "${query}"`

          )}
        </Title>
      </Row>
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Filtrer par objet">
            <SideMenuLink className={(type === 'rechercher') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`/rechercher?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-search-eye-line" size="1x" />
                  Tous les objets
                </Text>
                <Badge type={(type === 'rechercher') ? 'info' : 'new'} text={countAll} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'structures') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`structures?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-building-line" size="1x" />
                  Structures
                </Text>
                <Badge type={(type === 'structures') ? 'info' : 'new'} text={counts.structures || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'personnes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`personnes?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-user-3-line" size="1x" />
                  Personnes
                </Text>
                <Badge type={(type === 'personnes') ? 'info' : 'new'} text={counts.persons || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'prix') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`prix?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-award-line" size="1x" />
                  Prix scientifiques
                </Text>
                <Badge type={(type === 'prix') ? 'info' : 'new'} text={counts.prizes || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'textes-officiels') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`textes-officiels?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-git-repository-line" size="1x" />
                  Textes officiels
                </Text>
                <Badge type={(type === 'textes-officiels') ? 'info' : 'new'} text={counts['official-texts'] || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'termes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`termes?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-hashtag" size="1x" />
                  Termes
                </Text>
                <Badge type={(type === 'termes') ? 'info' : 'new'} text={counts.terms || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'categories') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`categories?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-price-tag-3-line" size="1x" />
                  Catégories
                </Text>
                <Badge type={(type === 'categories') ? 'info' : 'new'} text={counts.categories || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'geographical-categories') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`geographical-categories?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-global-line" size="1x" />
                  Catégories
                  {' '}
                  <Badge type={(type === 'geographical-categories') ? 'info' : 'new'} text={counts['geographical-categories'] || '0'} />
                  géographiques
                </Text>
              </Row>
            </SideMenuLink>
            {/* TODO: Restore projects */}
            {/*
            <SideMenuLink className={(type === 'projets') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`projets?query=${query}&page=1`} replace />}>
              <Row alignItems="top">
                <Text spacing="pr-2v" bold>
                  <Icon name="ri-booklet-line" size="1x" />
                  Projets
                </Text>
                <Badge type={(type === 'projets') ? 'info' : 'new'} text={counts.projects || '0'} />
              </Row>
            </SideMenuLink>
            */}
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          {isLoading && <Row className="fr-my-2w flex--space-around"><Spinner /></Row>}
          {error && <p>Erreur...</p>}
          {data && <SearchResults data={data} />}
          {!!resultsCount && (
            <Row className="flex--space-around fr-pt-3w">
              <Pagination currentPage={Number(currentPage)} pageCount={pageCount} onClick={(page) => { setSearchParams({ page, query }); }} />
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
