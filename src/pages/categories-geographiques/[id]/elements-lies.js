import { Badge, Col, Container, Row, Tag, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';

import Map from '../../../components/map';
import { PageSpinner } from '../../../components/spinner';
import { ExceptionStructuresList, StructuresList } from './structuresList';

export default function GeographicalCategoryRelatedElements() {
  const { url, id } = useUrl();
  const { data } = useFetch(url);

  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures`);

  const exceptionGps = [];
  const exception = useFetch('/geographical-exceptions');

  if (exception?.data?.data) {
    const geographicalCategoryIds = exception.data.data.map((item) => item.geographicalCategoryId);
    if (geographicalCategoryIds.includes(id)) {
      const item = exception.data.data.find((el) => el.geographicalCategoryId === id);
      if (
        item.resource
        && item.resource.currentLocalisation
        && item.resource.currentLocalisation.geometry
        && item.resource.currentLocalisation.geometry.coordinates
      ) {
        exceptionGps.push({
          ...item,
        });
      }
    }
  }
  let structuresContent = null;
  if (structuresLoading) {
    structuresContent = <PageSpinner />;
  } else if (dataStructures?.data?.length > 0) {
    structuresContent = (
      <>
        <Title as="h2" look="h4">
          Structures associées
          <Badge text={dataStructures.totalCount} colorFamily="yellow-tournesol" />
        </Title>
        <Row className="fr-mb-3w">
          <Col>
            <Map
              markers={
                dataStructures.data.map((item) => ({
                  label: item.currentName.usualName,
                  latLng: item.currentLocalisation?.geometry?.coordinates?.toReversed(),
                  address: `{${item.currentLocalisation?.address || ''},
                ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}}`,
                }))
              }
            />
          </Col>
        </Row>
        <StructuresList
          data={dataStructures.data}
        />
        <Row className="fr-mt-3w">
          <Col>
            <Title as="h2" look="h4">
              Autres structures associées en dehors du territoire
              <Badge text={exceptionGps.length} colorFamily="yellow-tournesol" />
            </Title>
            <Row className="fr-mb-3w">
              <Col>
                <Map
                  markers={
                    exceptionGps.map((item) => ({
                      label: item.resource.currentName.displayName,
                      latLng: item.resource.currentLocalisation?.geometry?.coordinates?.toReversed(),
                      address: `${item.currentLocalisation?.address || ''},
                ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}`,
                    }))
                  }
                />
              </Col>
            </Row>
            <ExceptionStructuresList
              exceptionGps={exceptionGps}
            />
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Container>
      <Title as="h2" look="h4">
        Catégorie parente
      </Title>
      {data?.closestParent && <Tag color="blue-ecume" className="fr-mb-3w" />}
      {structuresContent}
    </Container>
  );
}
