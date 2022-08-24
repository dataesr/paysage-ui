import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardDescription, CardTitle, Col, Highlight, Modal, ModalContent, ModalTitle, Row, Title } from '@dataesr/react-dsfr';
import PaysageSection from '../../Section';
import EmailForm from './form';
import fetch from '../../../utils/fetch';

export default function EmailsComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch
        .get(`/${apiObject}/${id}/emails`)
        .catch((e) => {
          console.log(e);
        });
      if (response.ok) setData(response.data);
    };
    getData();
    return () => {};
  }, [apiObject, id, reloader]);

  const onSaveHandler = async (body, emailId = null) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/emails`;

    if (emailId) {
      method = 'patch';
      url += `/${emailId}`;
    }

    const response = await fetch[method](url, body).catch((e) => { console.log(e); });

    if (response.ok) {
      setReloader((reloader + 1));
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (emailId) => {
    const url = `/${apiObject}/${id}/emails/${emailId}`;
    await fetch.delete(url).catch((e) => { console.log(e); });
    setReloader(reloader + 1);
    setShowModal(false);
  };

  const onClickModifyHandler = (genericEmail) => {
    setModalTitle("Modification d'une boite email générique");
    setModalContent(
      <EmailForm
        data={genericEmail}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'une boite email générique");
    setModalContent(<EmailForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Emails génériques" id="emails" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Emails génériques" id="emails">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Boites emails génériques
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter un email générique
          </Button>
        </Col>
      </Row>
      <Row>
        {data.data.length === 0 ? (
          <Highlight className="fr-highlight--yellow-tournesol">
            Cette section est vide pour le moment
          </Highlight>
        ) : null}
        {data.data.map((gm) => (
          <Col n="4" key={gm.id}>
            <Card hasArrow={false} onClick={() => onClickModifyHandler(gm)}>
              <CardTitle>{gm.emailType.usualName}</CardTitle>
              <CardDescription>{gm.email}</CardDescription>
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

EmailsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
