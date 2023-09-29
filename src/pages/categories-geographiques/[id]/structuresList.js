import { Badge, Col, Icon, Row, Tile, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { getName } from '../../../utils/structures';
import { formatDescriptionDates } from '../../../utils/dates';
import { capitalize } from '../../../utils/strings';
import ExpendableListCards from '../../../components/card/expendable-list-cards';

const getDescription = (item) => {
  let description = '';
  description += item?.category ? item.category : '';
  if (item?.city) {
    description += item.city.length > 0 ? ` à ${item.city[0]}` : '';
  } else {
    description += item?.locality && item.locality.length > 0 ? ` à ${item.locality[0]}` : '';
  }
  description += item?.creationDate ? ` ${formatDescriptionDates(item?.creationDate)}` : '';

  return capitalize(description.trim());
};
export function StructuresList({ data }) {
  const [filter, setFilter] = useState('');
  if (!data && !data?.data) {
    return null;
  }

  const list = data
    .filter((item) => item.currentName.usualName.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    .map((item) => (
      <Row gutters>
        <Col n="12" as="li" key={item.id}>
          <Tile horizontal color="var(--structures-color)">
            <div className="fr-tile__body">
              <p className="fr-tile__title">
                <RouterLink className="fr-tile__link fr-link--md" to={`/structures/${item.id}`}>
                  <Icon name="ri-building-line" size="1x" color="var(--structures-color)" />
                  {getName(item)}
                </RouterLink>
              </p>
              {item.structureStatus === 'inactive' ? (
                <Badge isSmall colorFamily="brown-opera" text="Inactive" spacing="mb-0" />
              ) : null}
              <p className="fr-tile__desc">{getDescription(item)}</p>
            </div>
          </Tile>
        </Col>
      </Row>
    ));

  return (
    <>
      <TextInput
        label="Filtre sur le nom de la structure"
        name="nameFilter"
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
      />
      <ExpendableListCards list={list} max="12" nCol="12 md-4" />
    </>
  );
}

export function ExceptionStructuresList({ exceptionGps }) {
  if (!exceptionGps) {
    return null;
  }

  const list = exceptionGps.map((item) => (
    <Col n="12" as="li" key={item.id}>
      <Tile horizontal color="var(--structures-color)">
        <div className="fr-tile__body">
          <p className="fr-tile__title">
            <RouterLink className="fr-tile__link fr-link--md" to={`/structures/${item.resource.id}`}>
              <Icon name="ri-building-line" size="1x" color="var(--structures-color)" />
              {getName(item)}
            </RouterLink>
          </p>
          {item?.resource?.structureStatus === 'inactive' ? (
            <Badge isSmall colorFamily="brown-opera" text="Inactive" spacing="mb-0" />
          ) : null}
          <p className="fr-tile__desc">{getDescription(item)}</p>
        </div>
      </Tile>
    </Col>

  ));

  return <ExpendableListCards list={list} nCol="12 md-6" />;
}

StructuresList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ExceptionStructuresList.propTypes = {
  exceptionGps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
