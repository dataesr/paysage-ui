import {
  Modal,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import { useState } from 'react';

import ExpendableListCards from '../../card/expendable-list-cards';
import WeblinkCard from '../../card/weblink-card';
import api from '../../../utils/api';
import WeblinkForm from '../../forms/weblinks';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { KEEP_TYPES } from './constants';
import useEnums from '../../../hooks/useEnums';
import useToast from '../../../hooks/useToast';

export default function Weblink() {
  const { url, apiObject } = useUrl('weblinks');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { weblinks } = useEnums();
  const { toast } = useToast();
  const options = weblinks[apiObject].filter((type) => KEEP_TYPES.includes(type.value));

  const onSaveHandler = async (body) => {
    const method = body.id ? 'patch' : 'post';
    const saveUrl = body.id ? `${url}/${body.id}` : url;
    await api[method](saveUrl, body)
      .then(() => { toast({ toastType: 'success', description: 'Le lien à été ajouté' }); reload(); setShowModal(false); })
      .catch(() => { toast({ toastType: 'error', description: "Une erreur s'est produite" }); });
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .then(() => { reload(); setShowModal(false); })
      .catch(() => { toast({ toastType: 'error', description: "Une erreur s'est produite" }); });
  };

  const onClickModifyHandler = (oneData) => {
    setModalTitle("Modification d'un lien web");
    setModalContent(
      <WeblinkForm
        data={oneData}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        options={options}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un lien web");
    setModalContent(
      <WeblinkForm onSaveHandler={onSaveHandler} options={options} />,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const filteredList = data.data.filter((el) => KEEP_TYPES.includes(el.type));
    const list = filteredList.map((el) => (
      <WeblinkCard
        downloadUrl={el.url}
        onClick={() => onClickModifyHandler(el)}
        title={options.find((type) => (el.type === type.value))?.label}
        type={el.type}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-4" order={KEEP_TYPES} sortOn="props.type" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Liens web</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un lien web</BlocActionButton>
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
