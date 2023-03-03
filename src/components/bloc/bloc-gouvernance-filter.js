/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import { Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import typeValidation from '../../utils/type-validation';

export default function BlocGouvernanceFilter({ counts, currentFilter, setFilter }) {
  const handleFilterClick = (filter) => {
    if (currentFilter === filter) return setFilter(null);
    return setFilter(filter);
  };
  const totalCount = Object.values(counts).reduce((total, current) => current + total, 0);
  if (!totalCount) return null;
  return (
    <>
      <Row alignItems="middle" spacing="mb-1v">
        <Text className="fr-m-0" size="sm" as="span"><i>Filtrer par type de fonction :</i></Text>
      </Row>
      <Row>
        <TagGroup>
          {Object.entries(counts)?.map(([filter, count]) => (
            <Tag size="sm" className="no-span" selected={currentFilter === filter} onClick={() => handleFilterClick(filter)}>
              {filter}
              {' '}
              (
              {count}
              )
            </Tag>
          ))}
        </TagGroup>
      </Row>
    </>
  );
}

BlocGouvernanceFilter.propTypes = {
  __TYPE: typeValidation('BlocGouvernanceFilter'),
  counts: PropTypes.shape.isRequired,
  currentFilter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};

BlocGouvernanceFilter.defaultProps = {
  __TYPE: 'BlocGouvernanceFilter',
};
