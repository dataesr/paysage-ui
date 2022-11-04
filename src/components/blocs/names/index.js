import { useState } from 'react';
import {
  Card,
  CardDescription,
  CardTitle,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import NameForm from '../../forms/names';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import Modal from '../../modal';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import ExpendableListCards from '../../card/expendable-list-cards';
import useNotice from '../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';

export default function NamesComponent() {
  const { notice } = useNotice();
  const { url } = useUrl('names');
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
    setModalTitle(element?.id ? "Modification d'un nom" : "Ajout d'un nom");
    setModalContent(
      <NameForm
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
      <Card
        isGrey
        hasBorder={false}
        hasArrow={false}
        onClick={() => onOpenModalHandler(item)}
        href="#"
      >
        <CardTitle>{item.usualName}</CardTitle>
        <CardDescription>
          {formatDescriptionDates(item.startDate, item.endDate)}
        </CardDescription>
      </Card>
    ));
    return <ExpendableListCards list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Dénominations</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un nom</BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
      <BlocModal>
        <Modal canClose={false} isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
