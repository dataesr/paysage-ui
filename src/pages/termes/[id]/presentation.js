import { Col, Row, Title } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import useHashScroll from '../../../hooks/useHashScroll';
import Wiki from '../../../components/blocs/wiki';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { TERME_PARENT } from '../../../utils/relations-tags';

export default function TermPresentationPage() {
  useHashScroll();
  return (
    <>
      <RelationsByTag
        tag={TERME_PARENT}
        blocName="Parents"
        resourceType="terms"
        relatedObjectTypes={['terms']}
        noRelationType
      />
      <RelationsByTag
        tag={TERME_PARENT}
        blocName="Enfants"
        resourceType="terms"
        relatedObjectTypes={['terms']}
        noRelationType
        inverse
      />
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Row spacing="mb-5w"><Wiki /></Row>
      <Row gutters>
        <Col n="12 md-6">
          <Weblinks />
        </Col>
        <Col n="12 md-6">
          <SocialMedias />
        </Col>
      </Row>
      <Identifiers />
    </>
  );
}
