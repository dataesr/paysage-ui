import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';
import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Row, SideMenu, SideMenuLink, Text, Title } from '@dataesr/react-dsfr';
import useSearch from '../../hooks/useSearch';
import Spinner from '../../components/spinner';

function SearchResults({ data }) {
  if (data && data.length) {
    return (
      <ul>
        {data.map((element) => (
          <li key={element.id}>{element.name}</li>
        ))}
      </ul>
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

const scopeTypesMapper = {
  structures: 'structures',
  personnes: 'persons',
  categories: 'categories',
  prix: 'prices',
  'textes-officiels': 'official-texts',
  projets: 'projects',
};

const countScopes = 'structures%2Cpersons%2Ccategories%2Cprices%2Cprojects%2Cterms';

export default function SearchPage() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const pathnameSplitted = pathname.split('/');
  const scope = pathnameSplitted[pathnameSplitted.length - 1];
  const { counts } = useSearch(countScopes, query, 1);
  const { data, isLoading, error } = useSearch(scopeTypesMapper[scope], query, 10);

  return (
    <Container spacing="pb-6w">
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/rechercher/structures" />}>Rechercher des structures</BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Title as="h2" look="h5">{`Résultats pour la recherche "${query}"`}</Title>
      </Row>
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Filtrer par objet">
            <SideMenuLink className={(scope === 'structures') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`structures?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Structures</Text>
                <Badge type={(scope === 'structures') ? 'info' : 'new'} text={counts.structures || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(scope === 'personnes') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`personnes?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Personnes</Text>
                <Badge type={(scope === 'personnes') ? 'info' : 'new'} text={counts.personnes || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(scope === 'categories') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`categories?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Catégories</Text>
                <Badge type={(scope === 'categories') ? 'info' : 'new'} text={counts.categories || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(scope === 'prix') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`prix?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Prix scientifiques</Text>
                <Badge type={(scope === 'prix') ? 'info' : 'new'} text={counts.prix || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(scope === 'textes-officiels') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`textes-officiels?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Textes officiels</Text>
                <Badge type={(scope === 'textes-officiels') ? 'info' : 'new'} text={counts['textes-officiels'] || '0'} />
              </Row>
            </SideMenuLink>
            <SideMenuLink className={(scope === 'projets') ? 'sidemenu__item--active' : ''} asLink={<RouterLink to={`projets?query=${query}`} />}>
              <Row alignItems="top" className="fr-row--space-between fullwidth">
                <Text spacing="pr-2v" bold>Projets</Text>
                <Badge type={(scope === 'projets') ? 'info' : 'new'} text={counts.projets || '0'} />
              </Row>
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          {isLoading && <Spinner />}
          {error && <p>Erreur...</p>}
          {data && <SearchResults data={data} />}
        </Col>
      </Row>
    </Container>
  );
}
