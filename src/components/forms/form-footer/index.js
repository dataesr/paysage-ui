import { ButtonGroup, Col, Row, Text } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useViewport from '../../../hooks/useViewport';
import Button from '../../button';

export default function FormFooter({ id, onDeleteHandler, onSaveHandler, buttonLabel }) {
  const { mobile } = useViewport();
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onDelete = (e) => {
    e.target.disabled = true;
    if (isDeleting) return;
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteHandler(id);
      setIsDeleting(false);
    }, 500);
  };

  const onSave = (e) => {
    e.target.disabled = true;
    if (isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      onSaveHandler(e);
      setIsSaving(false);
    }, 500);
  };

  const classnames = classNames('flex--space-between', { 'flex--col-reverse': mobile });
  return (
    <>
      <hr />
      {confirm && (
        <Row>
          <Col n="12 md-6">
            <Text bold>Etes-vous sûr de vouloir supprimer cet élément ?</Text>
          </Col>
          <Col n="12 md-6">
            <ButtonGroup align="right" isInlineFrom="md">
              <Button
                onClick={() => setConfirm(false)}
                secondary
              >
                Annuler
              </Button>
              <Button
                onClick={onDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
                color="error"
                icon="ri-chat-delete-line"
              >
                Supprimer
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
      {!confirm && (
        <Row>
          <Col>
            <ButtonGroup isInlineFrom="md" className={classnames}>
              {(id && onDeleteHandler) ? (
                <Button
                  onClick={() => setConfirm(true)}
                  color="error"
                  secondary
                  icon="ri-chat-delete-line"
                >
                  Supprimer
                </Button>
              ) : <div />}
              <Button
                icon="ri-save-line"
                onClick={onSave}
                isLoading={isSaving}
                disabled={isSaving}
              >
                {buttonLabel}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
    </>
  );
}

FormFooter.propTypes = {
  buttonLabel: PropTypes.string,
  id: PropTypes.string,
  onSaveHandler: PropTypes.func.isRequired,
  onDeleteHandler: PropTypes.func,
};

FormFooter.defaultProps = {
  buttonLabel: 'Sauvegarder',
  id: null,
  onDeleteHandler: () => {},
};
