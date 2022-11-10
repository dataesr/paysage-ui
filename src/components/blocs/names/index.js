import { useState } from 'react';
import {
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
import Button from '../../button';

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
      <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <p className="fr-card__title">
              <span className="fr-pr-1w">
                {item.usualName}
              </span>
            </p>
            <p className="fr-card__desc">
              {formatDescriptionDates(item.startDate, item.endDate)}
            </p>
            <div className="fr-card__start">
              <p className="fr-card__detail fr-text--sm fr-mb-0">
                Dénomination
              </p>
            </div>
            <Button
              color="text"
              size="md"
              onClick={() => onOpenModalHandler(item)}
              tertiary
              borderless
              rounded
              icon="ri-edit-line"
              className="edit-button"
            />
          </div>
        </div>
      </div>
    ));
    return <ExpendableListCards list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Dénominations</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un nom</BlocActionButton>
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
