import PropTypes from 'prop-types';
import Card from './index';

export default function TripleDotCard({ title, description, onClick }) {
  return (
    <Card
      title={title}
      description={description}
      onClick={onClick}
      buttonIcon="ri-more-2-fill"
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
