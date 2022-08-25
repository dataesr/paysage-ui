import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import PaysageSection from '../../Sections/section';
import EmptySection from '../../Sections/empty';
import NameForm from './form';
import api from '../../../utils/api';

export default function NamesComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(`/${apiObject}/${id}/names`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, nameId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/names`;

    if (nameId) {
      method = 'patch';
      url += `/${nameId}`;
    }

    const response = await api[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (nameId) => {
    const url = `/${apiObject}/${id}/names/${nameId}`;
    await api.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (Name) => {
    setModalTitle("Modification d'un nom");
    setModalContent(
      <NameForm
        data={Name}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un nom");
    setModalContent(<NameForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const formatDescriptionDates = (startDate = null, endDate = null) => {
    if (!startDate && !endDate) { return null; }
    if (!startDate && endDate) {
      return `jusqu'au ${endDate}`;
    }
    if (startDate && !endDate) {
      return `depuis le ${startDate}`;
    }
    if (startDate && endDate) {
      return `du ${startDate} au ${endDate}`;
    }
    return null;
  };

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Noms" id="names" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Noms" id="names">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Noms
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un nom
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.length === 0 ? <EmptySection apiObject={apiObject} /> : null}
        {data.data.map((item) => (
          <Col n="4" key={item.id}>
            <Card hasArrow={false} onClick={() => onClickModifyHandler(item)}>
              <CardTitle>{item.usualName}</CardTitle>
              <CardDescription>
                {formatDescriptionDates(item.startDate, item.endDate)}
              </CardDescription>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>{modalTitle}</ModalTitle>
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
    </PaysageSection>
  );
}

NamesComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
