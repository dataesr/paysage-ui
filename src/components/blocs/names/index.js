import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardDescription,
  CardTitle,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import NameForm from './form';
import api from '../../../utils/api';
import { formatDescriptionDates } from '../../../utils/dates';
import Modal from '../../modal';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import ExpendableListCards from '../../card/expendable-list-cards';
import useToast from '../../../hooks/useToast';

export default function NamesComponent({ apiObject }) {
  const { toast } = useToast();
  const { url } = useBlocUrl('names');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body) => {
    const method = body.id ? 'patch' : 'post';
    const saveUrl = body.id ? `${url}/${body.id}` : url;
    const response = await api[method](saveUrl, body)
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });
    if (response.ok) {
      toast({
        toastType: 'success',
        description: 'Le nom à été ajouté',
      });
      reload();
      setShowModal(false);
    }
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });
    reload();
    setShowModal(false);
  };

  const onClickModifyHandler = (Name) => {
    setModalTitle("Modification d'un nom");
    setModalContent(
      <NameForm
        data={Name}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un nom");
    setModalContent(<NameForm onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = data.data.map((item) => (
      <Card
        hasArrow={false}
        onClick={() => onClickModifyHandler(item)}
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
      <BlocTitle as="h3" look="h6">Noms</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un nom</BlocActionButton>
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
