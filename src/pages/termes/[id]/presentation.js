import { Col, Row, Title } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import useHashScroll from '../../../hooks/useHashScroll';
import Wiki from '../../../components/blocs/wiki';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { TERME_PARENT } from '../../../utils/relations-tags';

export default function TermPresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;

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
      <Col n="12">
        <KeyValueCard
          titleAsText
          className="card-terms"
          cardKey="Description"
          cardValue={data?.descriptionFr || data?.descriptionEn}
          icon="ri-align-left"
        />
      </Col>
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
