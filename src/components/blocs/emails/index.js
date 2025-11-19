import { useState } from 'react';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import EmailForm from '../../forms/emails';
import api from '../../../utils/api';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useNotice from '../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';
import KeyValueCard from '../../card/key-value-card';

export default function EmailsComponent() {
  const { url } = useUrl('emails');
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
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
    setModalTitle(element?.id ? "Modification d'une boite email générique" : "Ajout d'une boite email générique");
    setModalContent(
      <EmailForm
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
    const list = data.data.map((el) => (
      <KeyValueCard
        key={el.id}
        cardKey={el.emailType?.usualName}
        cardValue={el.email}
        icon="ri-mail-line"
        className="card-structures"
        onEdit={() => onOpenModalHandler(el)}
        copy
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Boites emails génériques</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un email générique</BlocActionButton>
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
