import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, Col, Container, Row, Title,
} from '@dataesr/react-dsfr';
import CopyBadgeButton from '../../components/copy/copy-badge-button';
import useUrl from '../../hooks/useUrl';
import { PageSpinner } from '../../components/spinner';
import useFetch from '../../hooks/useFetch';
import RelationsByTag from '../../components/blocs/relations-by-tag';
import { STRUCTURE_TUTELLE } from '../../utils/relations-tags';
import SupervisorsForm from '../../components/forms/supervisors';
import { capitalize } from '../../utils/strings';
import Error from '../../components/errors';

export default function SupervisingMinistersByIdPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  useEffect(() => { document.title = `Ministre de tutelle · ${data?.usualName}`; }, [data]);

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
              <BreadcrumbItem>{capitalize(data.usualName)}</BreadcrumbItem>
            </Breadcrumb>
          </Row>
          <Row>
            <Title as="h2">
              {capitalize(data.usualName)}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="Ministre de tutelle" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
          </Row>
          <RelationsByTag
            tag={STRUCTURE_TUTELLE}
            blocName="Établissements sous tutelle"
            resourceType="supervising-ministers"
            relatedObjectTypes={['structures']}
            Form={SupervisorsForm}
          />
        </Col>
      </Row>
    </Container>
  );
}
