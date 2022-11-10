import { Container, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import Avatar from '../avatar';
import { toString } from '../../utils/dates';

import styles from './styles.scss';

export default function PaysageBlame({ createdBy, createdAt, updatedBy, updatedAt }) {
  const creation = () => {
    if (!createdBy?.id) return null;
    return (
      <div className="flex flex--center">
        <Text spacing="mr-1v mb-0" size="xs">
          Créé le
          {' '}
          {toString(createdAt, false, true)}
          {' par '}
          {`${createdBy.firstName} ${createdBy.lastName}`}
        </Text>
        <Avatar name={createdBy.lastName} size="20px" src={createdBy.avatar} />
      </div>
    );
  };
  const lastUpdate = () => {
    if (!updatedBy?.id) return null;
    return (
      <div className="flex flex--center">
        <Text spacing="mr-1v mb-0" size="xs">
          Modifié le
          {' '}
          {toString(updatedAt, false, true)}
          {' par '}
          {`${updatedBy.firstName} ${updatedBy.lastName}`}
        </Text>
        <Avatar name={updatedBy.lastName} size="20px" src={updatedBy.avatar} />
      </div>
    );
  };
  return (
    <Container fluid spacing="pb-2w" className={styles.blame}>
      {creation()}
      {lastUpdate()}
    </Container>
  );
}

PaysageBlame.propTypes = {
  createdAt: PropTypes.string,
  createdBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.string,
  }),
  updatedAt: PropTypes.string,
  updatedBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.string,
  }),
};

PaysageBlame.defaultProps = {
  createdAt: null,
  createdBy: {},
  updatedAt: null,
  updatedBy: {},
};
