import { useState } from 'react';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import SocialMediaForm from '../../forms/social-media';
import ExpendableListCards from '../../card/expendable-list-cards';
import api from '../../../utils/api';
import SocialMediaCard from '../../card/social-media-card';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useNotice from '../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';

export default function SocialMediasComponent() {
  const { url } = useUrl('social-medias');
  const { notice } = useNotice();
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, itemId) => {
    const method = itemId ? 'patch' : 'post';
    const saveUrl = itemId ? `${url}/${itemId}` : url;
    await api[method](saveUrl, body)
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .then(() => { notice(deleteSuccess); reload(); })
      .catch(() => notice(deleteError));
    return setShowModal(false);
  };
  const onOpenModalHandler = (element) => {
    setModalTitle(element?.id ? "Modification d'un réseau social" : "Ajout d'un réseau social");
    setModalContent(
      <SocialMediaForm
        id={element?.id}
        data={element || {}}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = data.data.map((item) => (
      <SocialMediaCard
        mediaName={item.type}
        account={item.account}
        onClick={() => onOpenModalHandler(item)}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 lg-6 md-12 sm-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h4" look="h6">Réseaux sociaux</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()} isSmall>Ajouter un réseau social</BlocActionButton>
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
