import { Link as RouterLink } from 'react-router-dom';
import {
  Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, Title,
} from '@dataesr/react-dsfr';
import CopyBadgeButton from '../../components/copy/copy-badge-button';
import useUrl from '../../hooks/useUrl';
import { PageSpinner } from '../../components/spinner';
import useFetch from '../../hooks/useFetch';
import { RelationsByTag } from '../../components/blocs/relations';
import { STRUCTURE_CATEGORIE_JURIDIQUE } from '../../utils/relations-tags';
import Error from '../../components/errors';
import usePageTitle from '../../hooks/usePageTitle';

export default function LegalCategoriesByIdPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  usePageTitle(`Catégorie juridique · ${data?.longNameFr}`);

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12">
          <Row className="flex--space-between flex--wrap stick">
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem>{data.longNameFr}</BreadcrumbItem>
            </Breadcrumb>
          </Row>
          <Row>
            <Title as="h2">
              {data.longNameFr}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="Catégorie juridique" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
          </Row>
          <RelationsByTag
            tag={STRUCTURE_CATEGORIE_JURIDIQUE}
            blocName="Liste"
            resourceType="structures"
            relatedObjectTypes={['legal-categories']}
            noRelationType
            inverse
          />
        </Col>
      </Row>
    </Container>
  );
}
