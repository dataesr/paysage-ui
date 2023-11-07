import { Badge, Col, Row, TextInput, Title } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';

import Map from '../../../components/map';
import { PageSpinner } from '../../../components/spinner';
import { ExceptionStructuresList, StructuresList } from './structuresList';
import { exportGeographicalCategoriesStructuresToCsv } from '../../../components/blocs/relations/utils/exports';

import { BlocActionButton } from '../../../components/bloc';

export default function GeographicalCategoryRelatedElements() {
  const { url, id } = useUrl();
  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures`);
  const [filter, setFilter] = useState('');

  const exceptionGps = [];
  const exception = useFetch('/geographical-exceptions');
  const filterMarkers = (data) => data
    .filter((item) => (item?.currentLocalisation?.geometry?.coordinates || []).length === 2)
    .filter((item) => item.currentName.usualName.toLowerCase().includes(filter.toLowerCase()))
    .map((item) => ({
      label: item.currentName.usualName,
      latLng: [item.currentLocalisation.geometry.coordinates[1], item.currentLocalisation.geometry.coordinates[0]],
      address: `{${item.currentLocalisation?.address || ''},
          ${item.currentLocalLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}}`,
    }));

  const filteredMarkers = filterMarkers(dataStructures?.data || []);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

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
    const filteredCardsData = dataStructures.data.filter((item) => item.currentName.usualName.toLowerCase().includes(filter.toLowerCase()));
    structuresContent = (
      <>
        <Title as="h2" look="h4">
          Structures associées
          <Badge text={filteredMarkers.length} colorFamily="yellow-tournesol" />
          <Col spacing="mb-1v" className="text-right">
            <BlocActionButton
              edit={false}
              icon="ri-download-line"
              onClick={() => exportGeographicalCategoriesStructuresToCsv({
                data: filteredCardsData,
                fileName: 'structure',
              })}
            >
              Télécharger la liste
            </BlocActionButton>
          </Col>
        </Title>
        <Row gutters className="fr-mb-3w">
          <Col>
            <Map markers={filteredMarkers} />
          </Col>
        </Row>
        <Row alignItems="middle" spacing="mb-1v">
          <Row gutters>
            <Col n="12">
              <StructuresList data={filteredCardsData} />
            </Col>
          </Row>
          <Col>
            <Title as="h2" look="h4">
              Autres structures associées en dehors du territoire
              <Badge text={exceptionGps.length} colorFamily="yellow-tournesol" />
            </Title>
            <Col>
              <Map
                markers={
                  exceptionGps
                    .filter((item) => (item?.currentLocalisation?.geometry?.coordinates || []).length === 2)
                    .map((item) => ({
                      label: item.resource.currentName.displayName,
                      latLng: [item.currentLocalisation.geometry.coordinates[1], item.currentLocalisation.geometry.coordinates[0]],
                      address: `${item.currentLocalisation?.address || ''},
                          ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}`,
                    }))
                }
              />
            </Col>
            <ExceptionStructuresList exceptionGps={exceptionGps} />
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Row spacing="mb-1v">
      <Col>
        <TextInput
          label="Filtre sur le nom de la structure"
          name="nameFilter"
          onChange={handleFilterChange}
          value={filter}
        />
        {structuresContent}
      </Col>
    </Row>
  );
}
