import PropTypes from 'prop-types';
import { ButtonGroup } from '@dataesr/react-dsfr';
import Button from '../../button';

export default function FormFooter({ id, onDeleteHandler, onSaveHandler }) {
  return (
    <>
      <hr />
      <ButtonGroup isInlineFrom="md" className="flex--space-between flex--col-reverse">
        {(id) ? (
          <Button
            onClick={() => onDeleteHandler(id)}
            color="error"
            secondary
            icon="ri-chat-delete-line"
          >
            Supprimer
          </Button>
        ) : <div />}
        <Button icon="ri-save-line" onClick={onSaveHandler}>Sauvegarder</Button>
      </ButtonGroup>
    </>
  );
}

FormFooter.propTypes = {
  id: PropTypes.string,
  onSaveHandler: PropTypes.func.isRequired,
  onDeleteHandler: PropTypes.func,
};

FormFooter.defaultProps = {
  id: null,
  onDeleteHandler: () => {},
};
