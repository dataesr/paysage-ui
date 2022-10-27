import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';
import { useParams } from 'react-router-dom';

import Identifiers from '../../../components/blocs/identifiers';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import Weblinks from '../../../components/blocs/weblinks';
import Wiki from '../../../components/blocs/wiki';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';

export default function ProjectPresentationPage() {
  useHashScroll();
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(`/projects/${id}`);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Row>
        <Title as="h2" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <RelationsByTag
        tag="participations"
        blocName="Participations"
        resourceType="projects"
        relatedObjectTypes={['structures', 'persons']}
      />
      <RelationsByTag
        tag="project-contact"
        blocName="Contact"
        resourceType="projects"
        relatedObjectTypes={['persons']}
        noRelationType
      />
      <Title as="h3" look="h4">
        Présence sur le web
      </Title>
      <Row gutters spacing="mb-5w">
        <Col n="12 md-6">
          <Weblinks />
        </Col>
        <Col n="12 md-6">
          <Wiki />
        </Col>
      </Row>
      <Identifiers />
      <Row gutters spacing="mb-5w">
        <Col n="12 md-6">
          <div>
            Date de début
          </div>
          <div>
            {data?.startDate || 'Non renseigné'}
          </div>
        </Col>
        <Col n="12 md-6">
          <div>
            Date de fin
          </div>
          <div>
            {data?.endDate || 'Non renseigné'}
          </div>
        </Col>
      </Row>
    </>
  );
}
