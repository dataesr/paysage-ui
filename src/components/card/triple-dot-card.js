import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Card from './index';

export default function TripleDotCard({ title, description, onClick }) {
  const actionElement = (
    <button onClick={onClick} type="button">
      <Icon className="ri-more-2-fill" size="lg" />
    </button>
  );
  return (
    <Card
      title={title}
      descriptionElement={description}
      actionElement={actionElement}
    />
  );
}

TripleDotCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

TripleDotCard.defaultProps = {
  title: '',
  description: '',
};