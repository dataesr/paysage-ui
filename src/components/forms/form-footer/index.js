import { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Col, Row, Text } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import Button from '../../button';
import useViewport from '../../../hooks/useViewport';

export default function FormFooter({ id, onDeleteHandler, onSaveHandler }) {
  const { mobile } = useViewport();
  const [confirm, setConfirm] = useState(false);
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
                onClick={() => onDeleteHandler(id)}
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
              <Button icon="ri-save-line" onClick={onSaveHandler}>Sauvegarder</Button>
            </ButtonGroup>
          </Col>
        </Row>
      )}
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
