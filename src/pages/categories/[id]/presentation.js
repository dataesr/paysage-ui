import { Row, Title, Icon } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import useHashScroll from '../../../hooks/useHashScroll';

export default function CategoryPresentationPage() {
  useHashScroll();
  return (
    <>
      <Row>
        <Title as="h2" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <RelationsByTag
        tag="structures-categories"
        blocName="Structures de la catégorie"
        resourceType="structures"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Weblinks />
      <SocialMedias />
      <Identifiers />
    </>
  );
}
