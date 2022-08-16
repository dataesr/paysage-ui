import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  Col,
  Container,
  Highlight,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import SocialMediaForm from './form';
import fetch from '../../../utils/fetch';
import getEnumKey from '../../../utils';

export default function SocialMediasComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  const enumKey = getEnumKey(apiObject, 'social-medias');

  useEffect(() => {
    const getData = async () => {
      const response = await fetch
        .get(`/${apiObject}/${id}/social-medias`)
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
    let url = `/${apiObject}/${id}/social-medias`;

    if (itemId) {
      method = 'patch';
      url += `/${itemId}`;
    }

    const response = await fetch[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    const url = `/${apiObject}/${id}/social-medias/${itemId}`;
    await fetch.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (oneData) => {
    setModalTitle("Modification d'un réseau social");
    setModalContent(
      <SocialMediaForm
        data={oneData}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        enumKey={enumKey}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un réseau social");
    setModalContent(
      <SocialMediaForm onSaveHandler={onSaveHandler} enumKey={enumKey} />,
    );
    setShowModal(true);
  };

  if (!data?.data) return <>Chargement...</>; // TODO Loader

  return (
    <Container fluid as="section" id="Les-reseaux-sociaux">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Réseaux sociaux
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un réseau social
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.length === 0 ? (
          <Highlight className="fr-highlight--yellow-tournesol">
            Cette section est vide pour le moment
          </Highlight>
        ) : null}
        {data.data.map((sm) => (
          <Col n="3" key={sm.id}>
            <Card hasArrow={false} onClick={() => onClickModifyHandler(sm)}>
              <CardTitle>{sm.type}</CardTitle>
              <CardDescription>{sm.account}</CardDescription>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>{modalTitle}</ModalTitle>
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
    </Container>
  );
}

SocialMediasComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
