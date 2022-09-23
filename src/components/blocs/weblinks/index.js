import {
  Modal,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';

import ExpendableListCards from '../../card/expendable-list-cards';
import WeblinkCard from '../../card/weblink-card';
import PaysageSection from '../../sections/section';
import { getEnumKey } from '../../../utils';
import api from '../../../utils/api';
import WeblinkForm from './form';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import { WEBLINKS_TYPES } from '../../../utils/constants';

export default function WeblinksComponent({ apiObject }) {
  const url = useBlocUrl('weblinks');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const enumKey = getEnumKey(apiObject, 'weblinks');

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
    setModalTitle("Modification d'un lien web");
    setModalContent(
      <WeblinkForm
        data={oneData}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
        enumKey={enumKey}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    setModalTitle("Ajout d'un lien web");
    setModalContent(
      <WeblinkForm onSaveHandler={onSaveHandler} enumKey={enumKey} />,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = data.data.filter((el) => Object.keys(WEBLINKS_TYPES).includes(el.type)).map((el) => (
      <WeblinkCard
        downloadUrl={el.url}
        onClick={() => onClickModifyHandler(el)}
        title={WEBLINKS_TYPES[el.type]}
        type={el.type}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-4" order={Object.keys(WEBLINKS_TYPES)} sortOn="props.type" />;
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

WeblinksComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
};
