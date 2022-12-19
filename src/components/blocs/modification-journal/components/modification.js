import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Text } from '@dataesr/react-dsfr';
import { toString } from '../../../../utils/dates';
import Avatar from '../../../avatar';

export default function Modification({ data }) {
  if (!data) return null;
  const { user = {}, createdAt, method, resourceType, resourceId, subResourceType } = data;
  return (
    <Col n="12" key={JSON.stringify(data)}>
      <div className="flex flex--center">
        <Avatar name={user.lastName} size="24px" src={user.avatar} />
        <Text spacing="ml-1v mb-0">
          {`${user.firstName} ${user.lastName}`}
          {' le '}
          {toString(createdAt, true, true)}
          {' a '}
          {['PUT', 'POST'].includes(method.toUpperCase()) && 'créé'}
          {['DELETE'].includes(method.toUpperCase()) && 'supprimé'}
          {['PATCH'].includes(method.toUpperCase()) && 'modifié'}
          {' un objet '}
          <Link to={`/${resourceType}/${resourceId}`}>{resourceType}</Link>
          {subResourceType && `/${subResourceType}`}
        </Text>
      </div>
    </Col>
  );
}

Modification.propTypes = {
  data: PropTypes.object,
};
Modification.defaultProps = {
  data: null,
};
