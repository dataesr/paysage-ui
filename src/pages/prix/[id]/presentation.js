import { Row, Title, Icon, Col } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import Weblinks from '../../../components/blocs/weblinks';
import useHashScroll from '../../../hooks/useHashScroll';
import LaureateForm from '../../../components/forms/laureate';
import Wiki from '../../../components/blocs/wiki';

export default function PricePresentationPage() {
  useHashScroll();

  return (
    <>
      <Row>
        <Title as="h2" look="h4">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <RelationsByTag
        tag="prix"
        blocName="Lauréats"
        resourceType="prices"
        relatedObjectTypes={['persons', 'structures']}
        Form={LaureateForm}
      />
      <Row gutters>
        <Col n="12 md-6">
          <Weblinks />
        </Col>
        <Col n="12 md-6">
          <Wiki />
        </Col>
      </Row>
      <Identifiers />
    </>
  );
}
