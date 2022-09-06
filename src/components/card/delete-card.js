import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Card from './index';

export default function DeleteCard({ title, description, onClick }) {
  const actionElement = (
    <button onClick={onClick} type="button">
      <Icon className="ri-delete-bin-line" size="lg" />
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

DeleteCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

DeleteCard.defaultProps = {
  title: '',
  description: '',
};
