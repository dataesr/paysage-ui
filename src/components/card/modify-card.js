import PropTypes from 'prop-types';
import Card from './index';
import Button from '../button';

export default function ModifyCard({ title, description, onClick }) {
  return (
    <Card
      title={title}
      descriptionElement={description}
      actionElement={(
        <Button
          size="sm"
          onClick={onClick}
          color="text"
          tertiary
          borderless
          rounded
          icon="ri-edit-line"
        />
      )}
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
