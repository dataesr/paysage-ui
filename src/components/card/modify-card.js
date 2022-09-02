import { Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Card from './index';

export default function ModifyCard({ title, description, onClick }) {
  const actionElement = (
    <button onClick={onClick} type="button">
      <Icon className="ri-edit-line" size="lg" />
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

ModifyCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ModifyCard.defaultProps = {
  title: '',
  description: '',
};
