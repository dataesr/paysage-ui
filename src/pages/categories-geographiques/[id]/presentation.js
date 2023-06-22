import { Col, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import Wiki from '../../../components/blocs/wiki';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import Map from '../../../components/map';

export default function GeographicalCategoryPresentationPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  const isTitleAsText = true;

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;

  const polygonCoordinates = data?.geometry;

  return (
    <>
      <Row spacing="mb-5w" gutters>
        <Col n="6">
          <KeyValueCard
            titleAsText={isTitleAsText.toString()}
            className="card-terms"
            cardKey="Description"
            cardValue={data?.descriptionFr || data?.descriptionEn || ''}
            icon="ri-align-left"
          />
        </Col>
        <Col n="6">
          <Map
            height="300px"
            polygonCoordinates={polygonCoordinates}
          />
        </Col>
      </Row>
      {data?.wikidata && (
        <>
          <Title as="h3" look="h4">Présence sur le web</Title>
          <Row spacing="mb-5w">
            <Wiki geographicalCategoryWiki={data.wikidata} />
          </Row>
        </>
      )}
    </>
  );
}
