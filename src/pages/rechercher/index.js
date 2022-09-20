import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Row, SideMenu, SideMenuLink, Text, Tile, TileBody, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';

import Spinner from '../../components/spinner';
import useSearch from '../../hooks/useSearch';
import { getTypeFromUrl, getUrlFromType } from '../../utils/types-url-mapper';

function SearchResults({ data }) {
  if (data && data.length) {
    return (
      <Row as="ul" gutters>
        {data.map((element) => (
          <Col n="12 md-6 lg-4" as="li" key={element.id}>
            <Tile color={`var(--${element.type}-color)`}>
              <TileBody
                titleAs="h5"
                title={element.name}
                asLink={<RouterLink to={`/${getUrlFromType(element.type)}/${element.id}`} />}
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

const countTypes = 'categories%2Clegal%2Dcategories%2Cofficial%2Dtexts%2Cpersons%2Cprices%2Cprojects%2Cstructures%2Cterms';

export default function SearchPage() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const pathnameSplitted = pathname.split('/');
  const type = pathnameSplitted[pathnameSplitted.length - 1];
  const { counts } = useSearch(countTypes, query, 0);
  const { data, isLoading, error } = useSearch(getTypeFromUrl(type), query, 10);

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
            <SideMenuLink className={(type === 'structures') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`structures?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Structures</Text>
                <Badge type={(type === 'structures') ? 'info' : 'new'} text={counts.structures || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'personnes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`personnes?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Personnes</Text>
                <Badge type={(type === 'personnes') ? 'info' : 'new'} text={counts.persons || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'categories') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`categories?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Catégories</Text>
                <Badge type={(type === 'categories') ? 'info' : 'new'} text={counts.categories || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'termes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`termes?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Termes</Text>
                <Badge type={(type === 'termes') ? 'info' : 'new'} text={counts.terms || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'prix') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`prix?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Prix scientifiques</Text>
                <Badge type={(type === 'prix') ? 'info' : 'new'} text={counts.prices || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'textes-officiels') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`textes-officiels?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Textes officiels</Text>
                <Badge type={(type === 'textes-officiels') ? 'info' : 'new'} text={counts['official-texts'] || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(type === 'projets') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`projets?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Projets</Text>
                <Badge type={(type === 'projets') ? 'info' : 'new'} text={counts.projects || '0'} />
              </Row>
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          {isLoading && <Row className="fr-my-2w fr-row--space-around"><Spinner /></Row>}
          {error && <p>Erreur...</p>}
          {data && <SearchResults data={data} />}
        </Col>
      </Row>
    </Container>
  );
}
