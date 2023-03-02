/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import { Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import typeValidation from '../../utils/type-validation';

export default function BlocFilter({ statusFilter, setStatusFilter, counts }) {
  const totalCount = Object.values(counts).reduce((total, current) => current + total, 0);
  if (!totalCount) return null;
  return (
    <>
      <Row alignItems="middle" spacing="mb-1v">
        <Text className="fr-m-0" size="sm" as="span"><i>Filtrer par status :</i></Text>
      </Row>
      <Row>
        <TagGroup>
          <Tag size="sm" className="no-span" selected={statusFilter === 'current'} onClick={() => setStatusFilter('current')}>
            Relations actuelles (
            {counts.current}
            )
          </Tag>

          <Tag size="sm" className="no-span" selected={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>
            Relations passées (
            {counts.inactive}
            )
          </Tag>

          <Tag size="sm" className="no-span" selected={statusFilter === 'forthcoming'} onClick={() => setStatusFilter('forthcoming')}>
            Relations futures (
            {counts.forthcoming}
            )
          </Tag>
        </TagGroup>
      </Row>
    </>
  );
}

BlocFilter.propTypes = {
  __TYPE: typeValidation('BlocFilter'),
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  counts: PropTypes.shape.isRequired,
};

BlocFilter.defaultProps = {
  __TYPE: 'BlocFilter',
};
