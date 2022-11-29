import { Row, Title, Icon, Col } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import Weblinks from '../../../components/blocs/weblinks';
import useHashScroll from '../../../hooks/useHashScroll';
import LaureateForm from '../../../components/forms/laureate';
import Wiki from '../../../components/blocs/wiki';
import { LAUREAT, PRIX_PORTEUR } from '../../../utils/relations-tags';
import KeyValueCard from '../../../components/card/key-value-card';
import useUrl from '../../../hooks/useUrl';
import useFetch from '../../../hooks/useFetch';
import { PageSpinner } from '../../../components/spinner';
import { Error404, Error500 } from '../../../components/errors';

export default function PricePresentationPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  useHashScroll();
  if (isLoading) return <PageSpinner />;
  if (error) return <Error500 />;
  if (!data) return <Error404 />;
  return (
    <>
      <Row>
        <Title as="h2" look="h4">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <Col n="12" spacing="mb-5w">
        <KeyValueCard
          titleAsText
          className="card-projects"
          cardKey="Description"
          cardValue={data?.descriptionFr || data?.descriptionEn}
          icon="ri-align-left"
        />
      </Col>
      <RelationsByTag
        tag={PRIX_PORTEUR}
        blocName="Structures décernant le prix"
        resourceType="prices"
        relatedObjectTypes={['structures']}
        Form={LaureateForm}
      />
      <RelationsByTag
        tag={LAUREAT}
        blocName="Lauréats"
        resourceType="prices"
        relatedObjectTypes={['persons', 'structures', 'projects']}
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
