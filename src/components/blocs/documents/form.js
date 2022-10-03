import {
  Alert,
  Container,
  Col,
  Row,
  Select,
  TextInput,
  File,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormFooter from '../../forms/form-footer';
import api from '../../../utils/api';
import DateInput from '../../date-input';
import validator from './validator';

export default function SocialMediaForm({ data, onDeleteHandler, onSaveHandler }) {
  const [savingErrors, setSavingErrors] = useState(null);
  const [errors, setReturnedErrors] = useState([]);

  const [documentTypeId, setDocumentTypeId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentStartDate, setDocumentStartDate] = useState(null);
  const [documentEndDate, setDocumentEndDate] = useState(null);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      const response = await api.get('/document-types?limit=50').catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setOptions(
          response.data.data.map((item) => ({
            label: item.usualName,
            value: item.id,
          })),
        );
        if (!data) {
          // valeur par défaut
          setDocumentTypeId(response.data.data[0].id);
        }
      }
    };
    getOptions();

    // // init si data
    // if (data) {
    //   setEmail(data.email || null);
    //   setEmailTypeId(data.emailType.id || null);
    // }
  }, [data]);

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
      type: documentTypeId,
      title: documentTitle,
      description: documentDescription,
      file: documentFile[0],
      startDate: documentStartDate,
      endDate: documentEndDate,
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
              label="Type du document"
              options={options}
              selected={documentTypeId}
              onChange={(e) => setDocumentTypeId(e.target.value)}
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
              label="Titre"
              value={documentTitle || ''}
              onChange={(e) => setDocumentTitle(e.target.value)}
              messageType={
                errors.find((el) => el.field === 'title') ? 'error' : ''
              }
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <TextInput
              label="Description"
              textarea
              value={documentDescription || ''}
              onChange={(e) => setDocumentDescription(e.target.value)}
              messageType={
                errors.find((el) => el.field === 'description') ? 'error' : ''
              }
            />
          </Col>
        </Row>
        <Row className="fr-pt-2w">
          <Col>
            <File
              onChange={(e) => setDocumentFile(e.target.files)}
              multiple={false}
              messageType={
                errors.find((el) => el.field === 'file') ? 'error' : ''
              }
            />
          </Col>
        </Row>
        <Row className="fr-pt-3w">
          <Col>
            <DateInput
              value={documentStartDate}
              label="Date de début"
              onDateChange={(v) => setDocumentStartDate(v)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DateInput
              value={documentEndDate}
              label="Date de fin"
              onDateChange={(v) => setDocumentEndDate(v)}
            />
          </Col>
        </Row>
        {savingErrors || null}
        <FormFooter
          id={data?.id}
          onSaveHandler={onSave}
          onDeleteHandler={onDeleteHandler}
        />
      </Container>
    </form>
  );
}

SocialMediaForm.propTypes = {
  data: PropTypes.shape,
  onDeleteHandler: PropTypes.func,
  onSaveHandler: PropTypes.func.isRequired,
};

SocialMediaForm.defaultProps = {
  data: null,
  onDeleteHandler: null,
};