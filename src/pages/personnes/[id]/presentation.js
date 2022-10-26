import { Row, Title, Col, TagGroup, Tag } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import useUrl from '../../../hooks/useUrl';
import PersonCurrentMandates from '../../../components/blocs/current-mandates';

export default function PersonPresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <Row className="fr-my-2w flex--space-around">Erreur...</Row>;
  return (
    <>
      {(data?.otherNames?.length > 0) && (
        <Row spacing="mb-5w">
          <Col n="12">
            <Title as="h3" look="h4">Autres formes du nom connues</Title>
          </Col>
          <Col n="12">
            <TagGroup>
              { data.otherNames.map((item) => <Tag key={item}>{item}</Tag>)}
            </TagGroup>
          </Col>
        </Row>
      )}
      <PersonCurrentMandates />
      <Title as="h3" look="h4">Présence sur le web</Title>
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
