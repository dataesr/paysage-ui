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
import PaysageSection from '../../sections/section';
import EmptySection from '../../sections/empty';
import WeblinkForm from './form';
import api from '../../../utils/api';
import { getEnumKey } from '../../../utils';

export default function WeblinksComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  const enumKey = getEnumKey(apiObject, 'weblinks');

  useEffect(() => {
    const getData = async () => {
      const response = await api
        .get(`/${apiObject}/${id}/weblinks`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, itemId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/weblinks`;

    if (itemId) {
      method = 'patch';
      url += `/${itemId}`;
    }

    const response = await api[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    const url = `/${apiObject}/${id}/weblinks/${itemId}`;
    await api.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (oneData) => {
    setModalTitle("Modification d'un lien web");
    setModalContent(
      <WeblinkForm
        data={oneData}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        enumKey={enumKey}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un lien web");
    setModalContent(
      <WeblinkForm onSaveHandler={onSaveHandler} enumKey={enumKey} />,
    );
    setShowModal(true);
  };

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Liens web" id="weblinks" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Liens web" id="weblinks">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Liens web
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un lien web
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.length === 0 ? <EmptySection apiObject={apiObject} /> : null}
        {data.data.map((wl) => (
          <Col n="3" key={wl.id}>
            <Card
              hasArrow={false}
              onClick={() => onClickModifyHandler(wl)}
              href="#"
            >
              <CardTitle>{wl.type}</CardTitle>
              <CardDescription>{wl.value}</CardDescription>
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

WeblinksComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};