import { Badge, Col, Icon, Row, Tile } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getName } from '../../../utils/structures';
import ExpendableListCards from '../../../components/card/expendable-list-cards';
import styles from '../../../components/card/styles.module.scss';
import GoToExpendableListCards from '../../../components/card/geo-expendable-list-cards';
import { PageSpinner } from '../../../components/spinner';

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

export function StructuresList({ data, id }) {
  const location = useLocation();
  const isPresentationPage = location.pathname === `/categories-geographiques/${id}/presentation`;

  const [filter] = useState('');
  if (!data && !data?.data) {
    return null;
  }

  if (!data || !data.length) {
    return <PageSpinner />;
  }

  const list = data
    .filter((item) => item?.currentName?.usualName.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    .map((item) => (
      <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
        <div className={`fr-card__body  ${styles['structures-border']} `}>
          <div className="fr-card__content">
            <p className={`fr-card__title ${styles['structures-title']}`}>
              <RouterLink className="fr-text--lg" to={`/structures/${item.id}`}>
                {getName(item)}
                <Icon iconPosition="right" name="ri-arrow-right-line" />
              </RouterLink>
            </p>
            <div className={`fr-card__end ${styles['card-end']}`}>
              <i>{getDescription(item)}</i>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <Row>
      <Col>
        {isPresentationPage ? (
          <GoToExpendableListCards id={id} list={list} max={6} nCol="12 md-6" />
        ) : (<ExpendableListCards id={id} list={list} max={6} nCol="12 md-6" />
        )}
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
  id: '',
};

StructuresList.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
};

ExceptionStructuresList.propTypes = {
  exceptionGps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
