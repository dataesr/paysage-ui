import { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Col, Container, Icon, Pagination, Row, Tag, Tile, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';

import { formatDescriptionDates } from '../../../utils/dates';
import { capitalize } from '../../../utils/strings';
import { getUrlFromType } from '../../../utils/types-url-mapper';
import { getName } from '../../../utils/structures';
import Map from '../../../components/map';

const pageSize = 10;

const getDescription = (item) => {
  let description = '';

  description += item?.category ? item.category : '';
  if (item?.city) {
    description += (item?.city && item?.city.length > 0) ? ` à ${item.city[0]}` : '';
  } else {
    description += (item?.locality && item?.locality.length > 0) ? ` à ${item.locality[0]}` : '';
  }
  description += item?.creationDate ? ` ${formatDescriptionDates(item?.creationDate)}` : '';

  return capitalize(description.trim());
};

function StucturesList({ data, currentPage }) {
  const start = (currentPage - 1) * pageSize;
  return (
    <Row as="ul" gutters>
      {data.slice(start, start + pageSize).map((item) => (
        <Col n="12 lg-6" as="li" key={item.id}>
          <Tile horizontal color={`var(--${item.type}-color)`}>
            <div className="fr-tile__body">
              <p className="fr-tile__title">
                <RouterLink className="fr-tile__link fr-link--md" to={`/${getUrlFromType(item.type)}/${item.id}`}>
                  <Icon name="ri-building-line" size="1x" color={`var(--${item.type}-color)`} />
                  {getName(item)}
                </RouterLink>
              </p>
              {item.structureStatus === 'inactive' && (
                <Badge
                  isSmall
                  colorFamily="brown-opera"
                  text="Inactive"
                  spacing="mb-0"
                />
              )}
              <p className="fr-tile__desc">
                {getDescription(item)}
              </p>
            </div>
          </Tile>
        </Col>
      ))}
    </Row>
  );
}

StucturesList.propTypes = {
  currentPage: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default function GeographicalCategoryRelatedElements() {
  const { url } = useUrl();
  const { data } = useFetch(url);
  const [page, setPage] = useState(1);
  const {
    data: dataStructures } = useFetch(`${url}/structures`);

  return (
    <Container>
      <Title as="h2" look="h4">Catégorie parente</Title>
      {data?.closestParent && (
        <Tag color="blue-ecume" className="fr-mb-3w">
          {data?.closestParent}
        </Tag>
      )}

      {dataStructures?.data?.length > 0 && (
        <>
          <Title as="h2" look="h4">
            Structures associées
            <Badge text={dataStructures?.totalCount} colorFamily="yellow-tournesol" />
          </Title>

          {dataStructures.data.length > 0 && (
            <>
              <Row className="fr-mb-3w">
                <Col>
                  <Map markers={
                    dataStructures.data.map((item) => ({
                      latLng: item.coordinates.toReversed(),
                    }))
                  }
                  />
                </Col>
              </Row>
              <StucturesList
                currentPage={Number(page)}
                data={dataStructures?.data}
              />
            </>
          )}
          <Row className="flex--space-around fr-pt-3w">
            <Pagination
              currentPage={Number(page)}
              onClick={(currentPage) => { setPage(currentPage); }}
              pageCount={Math.ceil(dataStructures.totalCount / pageSize)}
              surrendingPages={2}
            />
          </Row>
        </>
      )}
    </Container>
  );
}
