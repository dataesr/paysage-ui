import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';

import IdentifierForm from '../../forms/identifier';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import api from '../../../utils/api';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useNotice from '../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';
import KeyValueCard from '../../card/key-value-card';

export default function IdentifiersComponent() {
  const { notice } = useNotice();
  const { url, apiObject } = useUrl('identifiers');
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
    setModalTitle(element?.id ? "Modification d'un identifiant" : "Ajout d'un identifiant");
    setModalContent(
      <IdentifierForm
        id={element?.id}
        data={element || {}}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const getLink = (el) => {
    let linkTo = '';
    switch (el.type) {
    case 'Wikidata':
      linkTo = `https://wikidata.org/wiki/${el.value}`;
      break;
    case 'idRef':
      linkTo = `https://www.idref.fr/${el.value}`;
      break;
    case 'ORCID':
      linkTo = `https://orcid.org/${el.value}`;
      break;
    case 'ROR':
      linkTo = `https://ror.org/${el.value}`;
      break;
    default:
    }
    return linkTo;
  };

  const renderCards = () => {
    if (!data) return null;
    const list = data.data.map((el) => (
      <KeyValueCard
        cardKey={el.type}
        cardValue={el.value}
        className={`card-${apiObject}`}
        copy
        icon="ri-fingerprint-2-line"
        key={el.id}
        onEdit={() => onOpenModalHandler(el)}
        linkTo={getLink(el)}
      />
    ));
    return <ExpendableListCards list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h4">Identifiants</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un identifiant</BlocActionButton>
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
