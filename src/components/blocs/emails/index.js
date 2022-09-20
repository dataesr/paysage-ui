import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Modal, ModalContent, ModalTitle, Row, Text, Title } from '@dataesr/react-dsfr';
import PaysageSection from '../../sections/section';
import EmailForm from './form';
import api from '../../../utils/api';
import ModifyCard from '../../card/modify-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import CopyButton from '../../copy/copy-button';

export default function EmailsComponent({ apiObject, id }) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [reloader, setReloader] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await api
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

    const response = await api[method](url, body).catch((e) => { console.log(e); });

    if (response.ok) {
      setReloader((reloader + 1));
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (emailId) => {
    const url = `/${apiObject}/${id}/emails/${emailId}`;
    await api.delete(url).catch((e) => { console.log(e); });
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

  const renderCards = () => {
    const list = data.data.map((el) => (
      <ModifyCard
        title={el.emailType.usualName}
        description={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{el.email}</Text>
            <CopyButton title="Copier l'identifiant" copyText={el.email} />
          </Row>
        )}
        onClick={() => onClickModifyHandler(el)}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-6" />;
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
        {renderCards()}
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
