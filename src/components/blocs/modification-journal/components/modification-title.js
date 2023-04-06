import { Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { toString } from '../../../../utils/dates';
import Avatar from '../../../avatar';

export default function ModificationTitle({ data }) {
  const { user = {}, createdAt, method, resourceType, subResourceType } = data;
  return (
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
        {resourceType}
        {subResourceType && `/${subResourceType}`}
      </Text>
    </div>
  );
}

ModificationTitle.propTypes = {
  data: PropTypes.object,
};
ModificationTitle.defaultProps = {
  data: null,
};
