import { Badge, Col, Row, Tag, TagGroup, Text, TextInput, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';

import Map from '../../../components/map/geographical-categories-map';
import { PageSpinner } from '../../../components/spinner';
import { ExceptionStructuresList, StructuresList } from './structuresList';
import { exportGeographicalCategoriesStructuresToCsv } from '../../../components/blocs/relations/utils/exports';

import { BlocActionButton } from '../../../components/bloc';

export default function GeographicalCategoryRelatedElements() {
  const { url, id } = useUrl();
  const name = useOutletContext();

  const limit = name === 'France' ? 2000 : 10000;
  const {
    data: dataStructures,
    isLoading: structuresLoading,
  } = useFetch(`${url}/structures?limit=${limit}`);

  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriesToShow, setCategoriesToShow] = useState(5);

  useEffect(() => {
    const query = searchParams.get('query');
    const category = searchParams.get('category');

    if (query !== null) {
      setFilter(query);
    }

    if (category !== null) {
      setCategoryFilter(category);
    }
  }, [searchParams]);

  const exceptionGps = [];
  const exception = useFetch('/geographical-exceptions');
  const filterMarkers = (data) => data
    .filter((item) => (item?.currentLocalisation?.geometry?.coordinates || []).length === 2)
    .filter((item) => item.currentName.usualName.toLowerCase().includes(filter.toLowerCase()))
    .filter((item) => !categoryFilter || item.category?.usualNameFr === categoryFilter)
    .map((item) => ({
      idStructure: item.id,
      label: item.currentName.usualName,
      latLng: item.currentLocalisation?.geometry?.coordinates?.toReversed(),
      address: `{${item.currentLocalisation?.address || ''},
                ${item.currentLocalisation?.postalCode || ''} ${item.currentLocalisation?.locality || ''}, ${item.currentLocalisation?.country}}`,
    }));

  const categoriesWithUniversity = dataStructures?.data
    .filter((item) => item.category?.usualNameFr === 'Université')
    .map(() => 'Université') || [];
  const uniqueCategories = Array.from(
    new Set([
      ...categoriesWithUniversity,
      ...dataStructures?.data?.map((item) => item.category?.usualNameFr).filter(Boolean) || [],
    ]),
  );
  const categoryCounts = uniqueCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a],
  );

  const topCategories = sortedCategories.slice(0, 5);

  const filteredMarkers = filterMarkers(dataStructures?.data || []);

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter(value);
    setSearchParams((params) => {
      params.set('query', value || '');
      return params;
    });
  };
  const handleCategoryFilterChange = (category) => {
    if (category === 'ShowMore') {
      setCategoriesToShow((prevCount) => (prevCount === 30 ? topCategories.length : 30));
    } else {
      setCategoryFilter((prevCategory) => (prevCategory === category ? '' : category));

      const currentSearchParams = new URLSearchParams(searchParams.toString());
      currentSearchParams.set('category', category === categoryFilter ? '' : category);
      setSearchParams(currentSearchParams);
    }
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

  function getCategoryCount(category) {
    const structuresWithCategory = dataStructures?.data?.filter((item) => item.category?.usualNameFr === category) || [];
    return structuresWithCategory.length;
  }

  if (structuresLoading) {
    structuresContent = <PageSpinner />;
  } else if (dataStructures?.data?.length > 0) {
    const filteredCardsData = dataStructures.data.filter((item) => {
      const nameMatchesFilter = item?.currentName?.usualName.toLowerCase().includes(filter.toLowerCase());
      const categoryMatchesFilter = !categoryFilter || item?.category?.usualNameFr === categoryFilter;
      return nameMatchesFilter && categoryMatchesFilter;
    });
    structuresContent = (
      <>
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
        <Title as="h2" look="h4">
          Structures associées
          <Badge text={filteredMarkers.length} colorFamily="yellow-tournesol" />
        </Title>
        <Row alignItems="middle" spacing="mb-1v">
          <Text className="fr-m-0" size="sm" as="span"><i>Filtrer par catégorie :</i></Text>
        </Row>
        <Row>
          <Col>
            <TagGroup>
              {sortedCategories.slice(0, categoriesToShow).map((category) => {
                const categoryCount = getCategoryCount(category);
                return (
                  <Tag
                    className="no-span"
                    key={category}
                    onClick={() => handleCategoryFilterChange(category)}
                    selected={category === categoryFilter}
                  >
                    {`${category} (${categoryCount})`}
                  </Tag>
                );
              })}
              <Tag
                colorFamily="brown-caramel"
                onClick={() => handleCategoryFilterChange('ShowMore')}
                active={!categoryFilter}
              >
                {categoriesToShow !== 30 ? 'Voir plus de catégories' : 'Voir moins de catégories'}
              </Tag>
            </TagGroup>
          </Col>
        </Row>
        <Row gutters className="fr-mb-3w">
          <Col n="12">
            <div aria-hidden>
              <Map
                height="400px"
                markers={filteredMarkers}
              />
            </div>
          </Col>
        </Row>
        <Row alignItems="middle" spacing="mb-1v">
          <Col n="12" spacing="mb-5w">
            <TextInput
              label={<span style={{ fontStyle: 'italic' }}>Filtre sur le nom de la structure</span>}
              name="nameFilter"
              onChange={handleFilterChange}
              value={filter}
            />
          </Col>
          <Col n="12">
            <StructuresList data={filteredCardsData} />
          </Col>
        </Row>
        <Row spacing="mt-3w">
          <Col>
            <Title as="h2" look="h4">
              Autres structures associées en dehors du territoire
              <Badge text={exceptionGps.length} colorFamily="yellow-tournesol" />
            </Title>
            <Col n="12">
              <div aria-hidden>
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
              </div>
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
        {structuresContent}
      </Col>
    </Row>
  );
}
