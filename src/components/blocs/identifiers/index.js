import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';

import IdentifierForm from '../../forms/identifier';
import ExpendableListCards from '../../card/expendable-list-cards';
import {
  Bloc,
  BlocActionButton,
  BlocContent,
  BlocModal,
  BlocTitle,
} from '../../bloc';
import KeyValueCard from '../../card/key-value-card';
import useEnums from '../../../hooks/useEnums';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { getTvaIntraFromSiren } from '../../../utils/get-tva-intra';
import {
  deleteError,
  deleteSuccess,
  saveError,
  saveSuccess,
} from '../../../utils/notice-contents';
import getLink from '../../../utils/get-links';

export default function IdentifiersComponent() {
  const { notice } = useNotice();
  const { url, apiObject } = useUrl('identifiers');
  const { data, isLoading, error, reload } = useFetch(`${url}?limit=500`);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { identifiers } = useEnums();
  const options = identifiers?.[apiObject];

  const onSaveHandler = async (body, itemId) => {
    const method = itemId ? 'patch' : 'post';
    const saveUrl = itemId ? `${url}/${itemId}` : url;
    await api[method](saveUrl, body)
      .then(() => {
        notice(saveSuccess);
        reload();
      })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api
      .delete(`${url}/${itemId}`)
      .then(() => {
        notice(deleteSuccess);
        reload();
      })
      .catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const onOpenModalHandler = (element) => {
    setModalTitle(
      element?.id ? "Modification d'un identifiant" : "Ajout d'un identifiant",
    );
    setModalContent(
      <IdentifierForm
        id={element?.id}
        data={element || {}}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
        options={options}
      />,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = [];
    const inactives = data.data.filter((el) => (el.active === false));
    const actives = data.data.filter((el) => (el.active !== false));
    const orderedList = [...actives, ...inactives];

    if (data) {
      orderedList?.forEach((el) => {
        const inactive = (el.active === false);
        list.push(
          <KeyValueCard
            cardKey={options?.find((type) => (el.type === type.value))?.label}
            cardValue={el.value}
            className={`card-${apiObject}`}
            copy
            icon="ri-fingerprint-2-line"
            key={el.id}
            onEdit={() => onOpenModalHandler(el)}
            linkTo={getLink(el)}
            inactive={inactive}
          />,
        );
        if (el.type === 'cnrs-unit') {
          list.push(
            <KeyValueCard
              cardKey="Voir dans GraFiLabo"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink({ ...el, type: 'cnrs-grafilabo' })}
              inactive={inactive}
            />,
          );
        }
        if (el.type === 'wikidata') {
          list.push(
            <KeyValueCard
              cardKey="Wikidata Fichier JSON"
              cardValue={el.value}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink({ ...el, type: 'wikidata_json' })}
              inactive={inactive}
            />,
          );
        }
        if (el.type === 'siret') {
          const siren = el.value.substring(0, 9);
          list.push(
            <KeyValueCard
              cardKey="Siren"
              cardValue={siren}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              linkTo={getLink({ ...el, type: 'siren' })}
              inactive={inactive}
            />,
          );
          list.push(
            <KeyValueCard
              cardKey="Numéro de TVA intracommunautaire"
              cardValue={getTvaIntraFromSiren(siren)}
              className={`card-${apiObject}`}
              copy
              icon="ri-fingerprint-2-line"
              key={el.id}
              onEdit={() => onOpenModalHandler(el)}
              inactive={inactive}
            />,
          );
        }
      });
    }
    return <ExpendableListCards list={list} />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h4">
        Identifiants
      </BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>
        Ajouter un identifiant
      </BlocActionButton>
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
