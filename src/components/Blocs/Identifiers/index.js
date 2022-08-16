import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  Col,
  Container,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import IdentifierForm from './form';
import fetch from '../../../utils/fetch';
import getEnumKey from '../../../utils';

export default function IdentifiersComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  const enumKey = getEnumKey(apiObject, 'identifiers');

  useEffect(() => {
    const getData = async () => {
      const response = await fetch
        .get(`/${apiObject}/${id}/identifiers`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, identifierId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/identifiers`;

    if (identifierId) {
      method = 'patch';
      url += `/${identifierId}`;
    }

    const response = await fetch[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      setReloader(reloader + 1);
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (emailId) => {
    const url = `/${apiObject}/${id}/identifiers/${emailId}`;
    await fetch.delete(url).catch((e) => {
      console.log(e);
    });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (genericEmail) => {
    setModalTitle("Modification d'un identifiant");
    setModalContent(
      <IdentifierForm
        data={genericEmail}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        enumKey={enumKey}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un identifiant");
    setModalContent(<IdentifierForm onSaveHandler={onSaveHandler} enumKey={enumKey} />);
    setShowModal(true);
  };

  if (!data?.data) return <>Chargement...</>; // TODO Loader

  return (
    <Container fluid as="section" id="Les-identifiants">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Identifiants
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un identifiant
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.map((ident) => (
          <Col n="3" key={ident.id}>
            <Card hasArrow={false} onClick={() => onClickModifyHandler(ident)}>
              <CardTitle>{ident.type}</CardTitle>
              <CardDescription>{ident.value}</CardDescription>
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

IdentifiersComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};