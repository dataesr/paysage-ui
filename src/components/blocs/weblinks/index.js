import PropTypes from 'prop-types';
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
import useEnums from '../../../hooks/useEnums';
import useNotice from '../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';

export default function Weblinks({ types, title }) {
  const { url, apiObject } = useUrl('weblinks');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { weblinks } = useEnums();
  const { notice } = useNotice();
  const options = types?.length
    ? weblinks[apiObject]?.filter((type) => types.includes(type.value))
    : weblinks[apiObject];

  const onSaveHandler = async (body) => {
    const method = body.id ? 'patch' : 'post';
    const saveUrl = body.id ? `${url}/${body.id}` : url;
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

  const onClickModifyHandler = (oneData) => {
    setModalTitle("Modification d'un lien");
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
    setModalTitle("Ajout d'un lien");
    setModalContent(
      <WeblinkForm onSaveHandler={onSaveHandler} options={options} />,
    );
    setShowModal(true);
  };

  const getElementsCount = () => {
    if (!data) return null;
    return data.data.filter((el) => types.includes(el.type))?.length;
  };

  const renderCards = () => {
    if (!data) return null;
    const filteredList = types.length
      ? data.data.filter((el) => types.includes(el.type))
      : data.data;
    const list = filteredList.map((el) => (
      <WeblinkCard
        downloadUrl={el.url}
        onClick={() => onClickModifyHandler(el)}
        title={options.find((type) => (el.type === type.value))?.label}
        type={el.type}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-4" order={types} sortOn="props.type" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={{ totalCount: getElementsCount() }}>
      <BlocTitle as="h4" look="h6">{title}</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un lien</BlocActionButton>
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

Weblinks.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

Weblinks.defaultProps = {
  types: [],
  title: 'Liens web',
};
