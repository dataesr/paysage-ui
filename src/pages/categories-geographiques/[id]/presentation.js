import { Badge, Col, Row, Title } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import KeyValueCard from '../../../components/card/key-value-card';
import Wiki from '../../../components/blocs/wiki';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import Map from '../../../components/map/geographical-categories-map';
import {
  ExceptionStructuresList,
  StructuresList,
} from './structuresList';
import { Bloc, BlocActionButton, BlocContent, BlocTitle } from '../../../components/bloc';
import { exportGeographicalCategoriesStructuresToCsv } from '../../../components/blocs/relations/utils/exports';
import GeographicalTags from '../../../components/blocs/geographical-tags';

export default function GeographicalCategoryPresentationPage() {
  const { url, id } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures`);

  const isTitleAsText = true;

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

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;

  const polygonCoordinates = data?.geometry;

  let markers = [];
  if (!structuresLoading && dataStructures?.data?.length > 0) {
    markers = dataStructures.data.map((item) => ({
      idStructure: item.id,
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

      {
        data?.parent && (
          <Row className="fr-mb-3w">
            <Col>
              <BlocTitle as="h3" look="h6">Catégorie géographique parente</BlocTitle>
              <GeographicalTags data={[data?.parent]} />
            </Col>
          </Row>
        )
      }

      <Row gutters>
        <Col n="6">
          <Map
            height="800px"
            markers={markers}
            polygonCoordinates={polygonCoordinates}
          />
        </Col>
        <Col n="6">
          <Row>
            <Col>
              <Title as="h2" look="h4">
                Structures associées
                <Badge
                  className="fr-ml-1w fr-mr-1w"
                  colorFamily="yellow-tournesol"
                  text={dataStructures?.totalCount.toString() || '0'}
                />
              </Title>
            </Col>
            <Col className="text-right">
              <BlocActionButton
                edit={false}
                icon="ri-download-line"
                onClick={() => exportGeographicalCategoriesStructuresToCsv({
                  data: dataStructures?.data,
                  fileName: `structure_${data?.nameFr}`,
                })}
              >
                Télécharger la liste
              </BlocActionButton>
            </Col>

          </Row>
          <StructuresList data={dataStructures?.data} />
        </Col>
      </Row>
      {
        exceptionGps?.length > 0 && (
          <Row className="fr-mt-3w">
            <Col>
              <Title as="h2" look="h4">
                Autres structures associées en dehors du territoire
                <Badge
                  className="fr-ml-1w"
                  colorFamily="yellow-tournesol"
                  text={exceptionGps.length.toString() || '0'}
                />
              </Title>
              <Col>
                <ExceptionStructuresList exceptionGps={exceptionGps} />
              </Col>
            </Col>
          </Row>

        )
      }

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
