import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, ModalContent, ModalTitle, Row, Title } from '@dataesr/react-dsfr';
import Button from '../../button';
import PaysageSection from '../../sections/section';
import SocialMediaForm from './form';
import ExpendableListCards from '../../card/expendable-list-cards';
import api from '../../../utils/api';
import { getEnumKey } from '../../../utils';
import SocialMediaCard from '../../card/social-media-card';
import useFetch from '../../../hooks/useFetch';

export default function SocialMediasComponent({ apiObject, id }) {
  const { data, isLoading, error, reload } = useFetch(`/${apiObject}/${id}/social-medias`);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const enumKey = getEnumKey(apiObject, 'social-medias');

  const onSaveHandler = async (body) => {
    let method = 'post';
    let url = `/${apiObject}/${id}/social-medias`;

    if (body.id) {
      method = 'patch';
      url += `/${body.id}`;
    }

    const response = await api[method](url, body).catch((e) => {
      console.log(e);
    });

    if (response.ok) {
      reload();
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    const url = `/${apiObject}/${id}/social-medias/${itemId}`;
    await api.delete(url).catch((e) => {
      console.log(e);
    });
    reload();
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

  const renderCards = () => {
    const list = data.data.map((item) => (
      <SocialMediaCard
        mediaName={item.type}
        account={item.account}
        onClick={() => onClickModifyHandler(item)}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} />;
  };

  if (!data?.data) {
    return (
      <PaysageSection dataPaysageMenu="Médias sociaux" id="socialMedias" isEmpty />
    );
  }

  return (
    <PaysageSection dataPaysageMenu="Médias sociaux" id="socialMedias" data={data} isLoading={isLoading} error={error}>
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
        {renderCards()}
      </Row>
      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>{modalTitle}</ModalTitle>
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
    </PaysageSection>
  );
}

SocialMediasComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
