import { Row, Title, Col } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import useHashScroll from '../../../hooks/useHashScroll';
import Wiki from '../../../components/blocs/wiki';
import { CATEGORIE_PARENT } from '../../../utils/relations-tags';

export default function CategoryPresentationPage() {
  useHashScroll();
  return (
    <>
      <RelationsByTag
        tag={CATEGORIE_PARENT}
        blocName="Parents"
        resourceType="categories"
        relatedObjectTypes={['categories']}
        noRelationType
        sort="relatedObject.priority"
      />
      <RelationsByTag
        tag={CATEGORIE_PARENT}
        blocName="Enfants"
        resourceType="categories"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
        sort="resource.priority"
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
