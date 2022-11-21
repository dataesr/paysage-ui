import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, Title,
} from '@dataesr/react-dsfr';
import CopyBadgeButton from '../../components/copy/copy-badge-button';
import useUrl from '../../hooks/useUrl';
import Spinner from '../../components/spinner';
import useFetch from '../../hooks/useFetch';
import RelationsByTag from '../../components/blocs/relations-by-tag';
import { STRUCTURE_CATEGORIE_JURIDIQUE } from '../../utils/relations-tags';

export default function LegalCategoriesByIdPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  useEffect(() => { document.title = `Catégorie juridique · ${data?.longNameFr}`; }, [data]);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
  if (!data) return null;
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
