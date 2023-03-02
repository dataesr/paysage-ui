import { Row, Title, Col } from '@dataesr/react-dsfr';

import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import { RelationsByTag } from '../../../components/blocs/relations';
import KeyValueCard from '../../../components/card/key-value-card';
import { PageSpinner } from '../../../components/spinner';
import useUrl from '../../../hooks/useUrl';
import useFetch from '../../../hooks/useFetch';
import Wiki from '../../../components/blocs/wiki';
import { CATEGORIE_PARENT } from '../../../utils/relations-tags';
import Error from '../../../components/errors';
import RelationCurrent from '../../../components/blocs/current-relations';

export default function CategoryPresentationPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;

  return (
    <>
      <RelationCurrent />
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
      <Col n="12">
        <KeyValueCard
          titleAsText
          className="card-categories"
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
