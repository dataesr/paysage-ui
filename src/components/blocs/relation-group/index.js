import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalTitle, Row, Text } from '@dataesr/react-dsfr';
import api from '../../../utils/api';
import ModifyCard from '../../card/modify-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import RelationForm from './form';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import useNotice from '../../../hooks/useNotice';
import { formatDescriptionDates } from '../../../utils/dates';

export default function RelationsGroup({ groupId, groupName, groupAccepts }) {
  const { notice } = useNotice();
  const url = useBlocUrl(`relations-groups/${groupId}/relations`);
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `${url}/${id}` : url;
    const response = await api[method](saveUrl, body)
      .catch(() => { notice({ content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' }); });
    if (response.ok) {
      notice({ content: 'La relation a été ajoutée avec succès.', autoDismissAfter: 6000, type: 'success' });
      reload();
    } else {
      notice({ content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' });
    }
    setShowModal(false);
  };

  const onDeleteHandler = async (id) => {
    const response = await api.delete(`${url}/${id}`).catch(() => {
      notice({ content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' });
    });
    if (response.ok) {
      reload();
    } else {
      notice({ content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' });
    }
    setShowModal(false);
  };

  const onClickModifyHandler = (element) => {
    setModalTitle('Modifier la relation');
    setModalContent(
      <RelationForm
        forObjects={groupAccepts}
        data={element}
        onDeleteHandler={onDeleteHandler}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  const onClickAddHandler = () => {
    if (!groupId) { setModalTitle('Ajouter une relation'); }
    setModalContent(<RelationForm forObjects={groupAccepts} onSaveHandler={onSaveHandler} />);
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const list = data.data.map((element) => (
      <ModifyCard
        // TODO:
        // What to do with relatedObject! Shared Model or Card adaptability ?
        title={`${element.relatedObject?.firstName} ${element.relatedObject?.lastName}`.trim() || element.id}
        description={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{element.relationType?.name || 'Appartient à la liste'}</Text>
            <Text spacing="mr-1v mb-0">{formatDescriptionDates(element.startDate, element.endDate)}</Text>
          </Row>
        )}
        onClick={() => onClickModifyHandler(element)}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">{groupName}</BlocTitle>
      <BlocActionButton onClick={onClickAddHandler}>Ajouter un élément</BlocActionButton>
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

RelationsGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  groupAccepts: PropTypes.arrayOf(PropTypes.string),
};

RelationsGroup.defaultProps = {
  groupAccepts: [''],
};
