import { Row, Title, Icon } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import useHashScroll from '../../../hooks/useHashScroll';

export default function ProjectPresentationPage() {
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
        tag="participations"
        blocName="Participations"
        resourceType="projects"
        relatedObjectTypes={['structures', 'persons']}
      />
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Weblinks />
      <SocialMedias />
      <Identifiers />
    </>
  );
}
