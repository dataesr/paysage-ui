import {
  Alert,
  ButtonGroup,
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../button';
import api from '../../../utils/api';
import validator from './validator';

export default function WeblinkForm({ data, onDeleteHandler, onSaveHandler, enumKey }) {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [weblinkType, setWeblinkType] = useState(null);
  const [weblinkUrl, setWeblinkUrl] = useState(null);
  const [weblinkLanguage, setWeblinkLanguage] = useState(null);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/docs/enums').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setOptions(
          response.data[enumKey].enum.map((item) => ({
            label: item,
            value: item,
          })),
        );
        if (!data) {
          // valeur par défaut
          setWeblinkType(response.data[enumKey].enum[0]);
        }
      }
    };
    getOptions();

    if (data) {
      setWeblinkType(data.type || null);
      setWeblinkUrl(data.url || null);
      setWeblinkLanguage(data.language || null);
    }
  }, [data, enumKey]);

  const setErrors = (err) => {
    setReturnedErrors(errors);
    setSavingErrors(
      <Row>
        <Col>
          <ul>
            {err.map((e) => (
              <li key={uuidv4()}>
                <Alert description={e.error} type="error" />
              </li>
            ))}
          </ul>
        </Col>
      </Row>,
    );
  };

  const onSave = () => {
    const body = {
      type: weblinkType,
      url: weblinkUrl,
      language: weblinkLanguage,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      onSaveHandler(body, data?.id || null);
    } else {
      setErrors(returnedErrors);
    }
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <Select
              label="Type"
              options={options}
              selected={weblinkType}
              onChange={(e) => setWeblinkType(e.target.value)}
              tanindex="0"
              required
              messageType={
                errors.find((el) => el.field === 'type') ? 'error' : ''
              }
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <TextInput
              label="URL"
              value={weblinkUrl || ''}
              onChange={(e) => setWeblinkUrl(e.target.value)}
              required
              messageType={
                errors.find((el) => el.field === 'url') ? 'error' : ''
              }
            />
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col>
            <ButtonGroup isEquisized align="right" isInlineFrom="md">
              {(data?.id) && (
                <Button
                  onClick={() => onDeleteHandler(data.id)}
                  color="error"
                  secondary
                  icon="ri-chat-delete-line"
                >
                  Supprimer
                </Button>
              )}
              <Button icon="ri-save-line" onClick={onSave}>Sauvegarder</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

WeblinkForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
  enumKey: PropTypes.string.isRequired,
};

WeblinkForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
