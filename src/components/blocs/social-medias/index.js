import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import SocialMediaForm from './form';
import ExpendableListCards from '../../card/expendable-list-cards';
import api from '../../../utils/api';
import { getEnumKey } from '../../../utils';
import SocialMediaCard from '../../card/social-media-card';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';

export default function SocialMediasComponent({ apiObject }) {
  const url = useBlocUrl('social-medias');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const enumKey = getEnumKey(apiObject, 'social-medias');

  const onSaveHandler = async (body) => {
    const method = body.id ? 'patch' : 'post';
    const saveUrl = body.id ? `${url}/${body.id}` : url;
    const response = await api[method](saveUrl, body).catch((e) => { console.log(e); });
    if (response.ok) {
      reload();
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`).catch((e) => { console.log(e); });
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
    if (!data) return null;
    const list = data.data.map((item) => (
      <SocialMediaCard
        mediaName={item.type}
        account={item.account}
        onClick={() => onClickModifyHandler(item)}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Réseaux sociaux</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un réseau social</BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}

SocialMediasComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
};
