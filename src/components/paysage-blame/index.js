import { Container, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { toString } from '../../utils/dates';
import Avatar from '../avatar';
import styles from './styles.module.scss';

export default function PaysageBlame({ createdBy, createdAt, updatedBy, updatedAt }) {
  const creation = () => {
    if (!createdBy?.id) return null;
    return (
      <div className="flex flex--center">
        <Text spacing="mr-1v mb-0" size="xs">
          Crée le
          {' '}
          {toString(createdAt)}
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
          {toString(updatedAt)}
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
  createdBy: PropTypes.shape,
  updatedBy: PropTypes.shape,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

PaysageBlame.defaultProps = {
  createdBy: null,
  updatedBy: null,
  createdAt: null,
  updatedAt: null,
};
