import { Link as RouterLink, Outlet } from 'react-router-dom';
import {
  Badge, BadgeGroup,
  Breadcrumb, BreadcrumbItem,
  Col, Container, Icon, Row,
  SideMenu,
  SideMenuLink,
  Title,
} from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';
import CopyBadgeButton from '../../components/copy/copy-badge-button';
import useUrl from '../../hooks/useUrl';
import { PageSpinner } from '../../components/spinner';

import GeographicalCategoriesPresentationPage from './[id]/presentation';
import GeographicalCategoriesRelatedElements from './[id]/elements-lies';
import Error from '../../components/errors';
import usePageTitle from '../../hooks/usePageTitle';
import { GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER } from '../../utils/constants';
import KeyValueCard from '../../components/card/key-value-card';
import getLink from '../../utils/get-links';

function GeographicalCategoriesByIdPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  usePageTitle(`Catégorie géographique · ${data?.nameFr}`);
  const wikidata = data?.wikidata || [];
  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;

  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="presentation" replace />}>
              <Icon name="ri-eye-2-line" size="1x" />
              En un coup d’œil
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="elements-lies" replace />}>
              <Icon name="ri-links-line" size="1x" />
              Eléments liés
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="elements-lies" replace />}>
              <Icon name="ri-bar-chart-box-line" size="1x" />
              Statistiques
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <Row className="flex--space-between flex--wrap stick">
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem
                asLink={<RouterLink to="/rechercher/termes?query=&page=1" />}
              >
                Catégories géographiques
              </BreadcrumbItem>
              <BreadcrumbItem>{data.usualNameFr}</BreadcrumbItem>
            </Breadcrumb>
          </Row>
          <Col n="12 md-12">
            <Row>
              <Title as="h2">
                {`${data.nameFr} (${GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[data.level]})`}
                <BadgeGroup className="fr-pt-1w">
                  <Badge text="Catégorie géographique" colorFamily="blue-ecume" />
                  <CopyBadgeButton
                    colorFamily="yellow-tournesol"
                    text={data.id}
                    lowercase
                  />
                </BadgeGroup>
              </Title>
            </Row>
            <Outlet />
          </Col>
          {wikidata.length > 0 && (
            <>
              <Title as="h3" look="h4">Présence sur le web</Title>
              <Row gutters>
                <Col n="12 md-3">
                  <KeyValueCard
                    cardKey="Wikidata"
                    cardValue={wikidata}
                    copy
                    icon="ri-fingerprint-2-line"
                    linkTo={getLink({ value: wikidata, type: 'wikidata' })}
                  />
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export {
  GeographicalCategoriesByIdPage,
  GeographicalCategoriesPresentationPage,
  GeographicalCategoriesRelatedElements,
};
