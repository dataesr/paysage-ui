import { Col, Icon, Tile } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toString } from '../../utils/dates';
import { getRelatedObjectName } from '../../utils/parse-related-element';

const icons = {
  structures: 'ri-building-line',
  persons: 'ri-user-3-line',
  categories: 'ri-price-tag-3-line',
  terms: 'ri-hashtag',
  prizes: 'ri-award-line',
  projects: 'ri-booklet-line',
  officialtexts: 'ri-git-repository-line',
};
export default function LastCreationCard({ item, n }) {
  const displayName = getRelatedObjectName(item);
  const { createdBy: user = {} } = item;
  return (
    <Col n={n}>
      <Tile horizontal color={`var(--${item.collection}-color)`}>
        <div className="fr-tile__body">
          <p className="fr-tile__title">
            <Link className="fr-tile__link fr-link--md" to={`/${item.collection}/${item.id}`}>
              <Icon name={icons[item.collection]} size="1x" color={`var(--${item.collection}-color)`} />
              {displayName}
            </Link>
          </p>
          <p className="fr-pl-3w fr-tile__desc fr-text--xs">
            Créé le
            {' '}
            {toString(item.createdAt, true)}
            {' par '}
            {`${user.firstName} ${user.lastName}`.trim()}
          </p>
        </div>
      </Tile>
    </Col>
  );
}
LastCreationCard.propTypes = {
  n: PropTypes.string,
  item: PropTypes.object.isRequired,
};
LastCreationCard.defaultProps = {
  n: '12 lg-4',
};
