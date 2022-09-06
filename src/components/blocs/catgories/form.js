import {
  ButtonGroup,
  Button,
  Icon,
  Container,
  Col,
  Row,
  TextInput,
  Title,
  Alert,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DateOneField from '../../date-one-field';
import validator from './validator';

export default function EmailForm({ data, onDeleteHandler, onSaveHandler }) {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [categoryId, setCategoryId] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const [categorySearchText, setCategorySearchText] = useState('');

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
      categoryId,
      endDate,
      startDate,
    };

    const { ok, returnedErrors } = validator(body);
    if (ok) {
      onSaveHandler(body, data?.id || null);
    } else {
      setErrors(returnedErrors);
    }
  };

  const categorySearch = (text) => {
    setCategorySearchText(text);
    if (text.length >= 2) {
      console.log('recherche');
    }
  };

  return (
    <form>
      <Container>
        <Row>
          <Col className="fr-pb-2w">
            <TextInput
              label="Recherche"
              value={categorySearchText || ''}
              onChange={(e) => categorySearch(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col n="12" className="fr-pb-5w">
            <Row>
              <Col>
                <Title as="h3" look="h6">
                  Dates
                </Title>
              </Col>
            </Row>
            <Row>
              <Col className="fr-pb-2w">
                <DateOneField
                  value={startDate}
                  name="startDate"
                  label="Date de début"
                  onValueChangeHandler={setStartDate}
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <DateOneField
                  value={endDate}
                  name="endDate"
                  label="Date de fin"
                  onValueChangeHandler={setEndDate}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <hr />
        {savingErrors || null}
        <Row>
          <Col>
            <ButtonGroup size="sm" isEquisized align="right" isInlineFrom="md">
              <Button
                onClick={() => onDeleteHandler(data?.id || null)}
                className="bt-delete"
                disabled={!data}
              >
                <Icon name="ri-chat-delete-line" size="lg" />
                Supprimer
              </Button>
              <Button onClick={onSave}>
                <Icon name="ri-save-line" size="lg" />
                Sauvegarder
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </form>
  );
}

EmailForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

EmailForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
