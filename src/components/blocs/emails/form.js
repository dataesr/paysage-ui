import {
  Container,
  Col,
  Row,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import FormFooter from '../../forms/form-footer';
import api from '../../../utils/api';

export default function EmailForm({ data, onDeleteHandler, onSaveHandler }) {
  const [email, setEmail] = useState(null);
  const [emailTypeId, setEmailTypeId] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/email-types?limit=50').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setOptions(
          response.data.data.map((item) => ({
            label: item.usualName,
            value: item.id,
          })),
        );
        if (!data) { // valeur par défaut
          setEmailTypeId(response.data.data[0].id);
        }
      }
    };
    getOptions();

    if (data) {
      setEmail(data.email || null);
      setEmailTypeId(data.emailType.id || null);
    }
  }, [data]);

  const onSave = () => {
    const body = { email, emailTypeId };
    onSaveHandler(body, data?.id || null);
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <Select
              label="Type"
              options={options}
              selected={emailTypeId}
              onChange={(e) => setEmailTypeId(e.target.value)}
              tanindex="0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TextInput
              label="Email"
              value={email || ''}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
        </Row>
        <FormFooter
          id={data?.id}
          onSaveHandler={onSave}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

EmailForm.propTypes = {
  data: PropTypes.object,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

EmailForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};
