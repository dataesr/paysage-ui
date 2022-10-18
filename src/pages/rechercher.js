import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Pagination, Row, SideMenu, SideMenuLink, Text, Tile, TileBody, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';

import Spinner from '../components/spinner';
import useHashScroll from '../hooks/useHashScroll';
import useSearch from '../hooks/useSearch';
import { getTypeFromUrl, getUrlFromType } from '../utils/types-url-mapper';

function SearchResults({ data }) {
  if (data && data.length) {
    return (
      <Row as="ul" gutters>
        {data.map((element) => (
          <Col n="12 lg-6" as="li" key={element.id}>
            <Tile horizontal color={`var(--${element.type}-color)`}>
              <TileBody
                titleAs="h5"
                title={element.name}
                asLink={<RouterLink to={`/${getUrlFromType(element.type)}/${element.id}`} />}
                description="Un attribut eventuel de l'objet paysage qui sera remonté par l'api"
              />
            </Tile>
          </Col>
        ))}
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

const countTypes = 'categories%2Clegal%2Dcategories%2Cofficial%2Dtexts%2Cpersons%2Cprices%2Cprojects%2Cstructures%2Cterms%2Cusers';

export default function SearchPage() {
  useHashScroll();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');
  const currentPage = searchParams.get('page');
  const itemsPerPage = 10;
  const start = itemsPerPage * (currentPage - 1);
  const pathnameSplitted = pathname.split('/');
  const type = pathnameSplitted[pathnameSplitted.length - 1];
  // TODO: Get counts and search result in the same query
  //       Set unset types if url is /rechercher/
  const { counts } = useSearch(countTypes, query, 0);
  const { data, error, isLoading } = useSearch(getTypeFromUrl(type), query, itemsPerPage, start);
  const countAll = Object.values(counts).reduce((accumulator, value) => accumulator + value, 0);
  const resultsCount = type === 'rechercher' ? countAll : (counts?.[getTypeFromUrl(type)] || 0);
  const pageCount = Math.ceil(resultsCount / itemsPerPage);

  return (
    <Container spacing="pb-6w">
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem>Rechercher</BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Title as="h2" look="h5">{`Résultats pour la recherche "${query}"`}</Title>
      </Row>
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Filtrer par objet">
            <SideMenuLink className={(type === 'rechercher') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`/rechercher?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Tous les objets</Text>
                <Badge type={(type === 'rechercher') ? 'info' : 'new'} text={countAll} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'structures') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`structures?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Structures</Text>
                <Badge type={(type === 'structures') ? 'info' : 'new'} text={counts.structures || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'personnes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`personnes?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Personnes</Text>
                <Badge type={(type === 'personnes') ? 'info' : 'new'} text={counts.persons || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'categories') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`categories?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Catégories</Text>
                <Badge type={(type === 'categories') ? 'info' : 'new'} text={counts.categories || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'categories-juridiques') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`categories-juridiques?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Catégories juridiques</Text>
                <Badge type={(type === 'categories-juridiques') ? 'info' : 'new'} text={counts['legal-categories'] || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'termes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`termes?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Termes</Text>
                <Badge type={(type === 'termes') ? 'info' : 'new'} text={counts.terms || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'prix') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`prix?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Prix scientifiques</Text>
                <Badge type={(type === 'prix') ? 'info' : 'new'} text={counts.prices || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'textes-officiels') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`textes-officiels?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Textes officiels</Text>
                <Badge type={(type === 'textes-officiels') ? 'info' : 'new'} text={counts['official-texts'] || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'projets') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`projets?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Projets</Text>
                <Badge type={(type === 'projets') ? 'info' : 'new'} text={counts.projects || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'utilisateurs') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`utilisateurs?query=${query}&page=1`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Utilisateurs</Text>
                <Badge type={(type === 'utilisateurs') ? 'info' : 'new'} text={counts.users || '0'} />
              </Row>
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          {isLoading && <Row className="fr-my-2w flex--space-around"><Spinner /></Row>}
          {error && <p>Erreur...</p>}
          {data && <SearchResults data={data} />}
          {!!resultsCount && (
            <Row className="flex--space-around fr-pt-2w">
              <Pagination currentPage={Number(currentPage)} pageCount={pageCount} onClick={(page) => { setSearchParams({ page, query }); }} className="lalilou" />
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
