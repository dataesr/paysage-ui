import { Badge, Col, Icon, Row, Tile } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { getName } from '../../../utils/structures';
import ExpendableListCards from '../../../components/card/expendable-list-cards';

const getDescription = (item) => {
  const filteredCategories = item.categories
    .filter((el) => el.priority >= 1 && el.priority <= 99)
    .sort((a, b) => a.priority - b.priority)
    .map((el) => el.usualNameFr);

  if (filteredCategories.length > 0) {
    return filteredCategories[0];
  }
  return [];
};

export function StructuresList({ data }) {
  const [filter] = useState('');
  if (!data && !data?.data) {
    return null;
  }
  const list = data
    .filter((item) => item.currentName.usualName.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    .map((item) => (
      <Col n="12" as="li" key={item.id}>
        <Tile horizontal color="var(--structures-color)">
          <div className="fr-tile__body">
            <p className="fr-tile__title">
              <RouterLink className="fr-tile__link fr-link--md" to={`/structures/${item.id}`}>
                <Icon name="ri-building-line" size="1x" color="var(--structures-color)" />
                {getName(item)}
              </RouterLink>
            </p>
            <p className="fr-tile__desc">{getDescription(item)}</p>
          </div>
        </Tile>
      </Col>
    ));

  return (
    <Row>
      <Col>
        <div style={{ height: '400px', overflowY: 'scroll' }}>
          <style>
            {`
              ::-webkit-scrollbar {
                width: 8px;
              }
              ::-webkit-scrollbar-vertical {
                width: 8px;
              }
              ::-webkit-scrollbar-thumb:vertical {
                background-color: gray;
              }
              
              ::-webkit-scrollbar-track:vertical {
                background-color: transparent;
              }
              `}
          </style>
          <ExpendableListCards list={list} max={5} nCol="12 md-6" />
        </div>
      </Col>
    </Row>
  );
}

export function ExceptionStructuresList({ exceptionGps }) {
  if (!exceptionGps) {
    return null;
  }

  const list = exceptionGps.map((item) => (
    <Row gutters>
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
    </Row>
  ));

  return <ExpendableListCards list={list} nCol="12 md-4" />;
}

StructuresList.defaultProps = {
  data: [],
};

StructuresList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()),
};

ExceptionStructuresList.propTypes = {
  exceptionGps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
