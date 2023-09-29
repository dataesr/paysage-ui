import { Badge, Col, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import Wiki from '../../../components/blocs/wiki';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import Map from '../../../components/map';
import {
  // ExceptionStructuresList,
  StructuresList,
} from './structuresList';
import { Bloc, BlocContent, BlocTitle } from '../../../components/bloc';

export default function GeographicalCategoryPresentationPage() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures`);

  const isTitleAsText = true;

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;

  const polygonCoordinates = data?.geometry;

  let markers = [];
  if (!structuresLoading && dataStructures?.data?.length > 0) {
    markers = dataStructures.data.map((item) => ({
      label: item.currentName.usualName,
      latLng: item.currentLocalisation?.geometry?.coordinates?.toReversed(),
      address: `{${item.currentLocalisation?.address || ''},
                ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}}`,
    }));
  }

  const identifiers = [];

  return (
    <>
      {
        (data?.descriptionFr || data?.descriptionEn) && (
          <Row spacing="mb-5w" gutters>
            <Col n="12">
              <KeyValueCard
                titleAsText={isTitleAsText.toString()}
                className="card-terms"
                cardKey="Description"
                cardValue={data?.descriptionFr || data?.descriptionEn || ''}
                icon="ri-align-left"
              />
            </Col>
          </Row>
        )
      }

      <Row>
        <Col n="12">
          <Map
            polygonCoordinates={polygonCoordinates}
            markers={markers}
          />
        </Col>
      </Row>
      <Title as="h2" look="h4" className="fr-mt-3w">
        Structures associées
        <Badge text={dataStructures?.totalCount || '...'} colorFamily="yellow-tournesol" />
      </Title>
      <StructuresList data={dataStructures?.data} />

      {identifiers.length > 0 && (
        <Bloc data={identifiers}>
          <BlocTitle as="h3" look="h4">
            Identifiants
          </BlocTitle>
          <BlocContent>
            bloc content
          </BlocContent>
        </Bloc>

      )}

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
