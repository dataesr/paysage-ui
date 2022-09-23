import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import CategoryForm from './form';
import DeleteCard from '../../card/delete-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';

export default function NamesComponent({ apiObject }) {
  const url = useBlocUrl('categories');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

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

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'une catégorie");
    setModalContent(<CategoryForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = data.data.map((el) => (
      <DeleteCard
        title={el.category?.usualNameFr}
        description={formatDescriptionDates(el.startDate, el.endDate)}
        onClick={() => onDeleteHandler(el.id)}
        bgColorClassName="bg-categories-light"
      />
    ));
    return (
      <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-4" />
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Categories</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter une catégorie</BlocActionButton>
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

NamesComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
};
