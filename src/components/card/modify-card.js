import PropTypes from 'prop-types';
import Card from './index';
import Button from '../button';
import useEditMode from '../../hooks/useEditMode';

export default function ModifyCard({ title, description, onClick }) {
  const { editMode } = useEditMode();
  return (
    <Card
      title={title}
      descriptionElement={description}
      actionElement={editMode && (
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
