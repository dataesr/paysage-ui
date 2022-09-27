import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, ModalContent, ModalTitle, Row, Text } from '@dataesr/react-dsfr';
import api from '../../../utils/api';
import ModifyCard from '../../card/modify-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import RelationsForm from '../../forms/relations';
import RelationsGroupForm from '../../forms/relations-group';
import useFetch from '../../../hooks/useFetch';
import useBlocUrl from '../../../hooks/useBlocUrl';
import useNotice from '../../../hooks/useNotice';
import { formatDescriptionDates } from '../../../utils/dates';
import parseRelatedElement from '../../../utils/parse-related-element';
import Map from '../../map/auto-bound-map';
import ScrallableListCards from '../../card/scrollable-list-card';

const deleteError = { content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' };
const saveError = { content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' };
const saveSuccess = { content: 'La relation a été ajoutée avec succès.', autoDismissAfter: 6000, type: 'success' };
const deleteSuccess = { content: 'La relation a été supprimée avec succès.', autoDismissAfter: 6000, type: 'success' };
const saveGroupeSuccess = { content: 'Le groupe a été modifié avec succès.', autoDismissAfter: 6000, type: 'success' };
const deleteGroupeSuccess = { content: 'Le groupe a été supprimée avec succès.', autoDismissAfter: 6000, type: 'success' };

export default function Relations({ group, reloader }) {
  const { id: groupId, name: groupName, accepts: groupAccepts } = group;
  const { notice } = useNotice();
  const listUrl = useBlocUrl('relations-groups');
  const url = `${listUrl}/${groupId}/relations`;
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveElementHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `${url}/${id}` : url;
    await api[method](saveUrl, body).then(() => { notice(saveSuccess); reload(); }).catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteElementHandler = async (id) => {
    await api.delete(`${url}/${id}`).then(() => { notice(deleteSuccess); reload(); }).catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const onSaveListHandler = async (body, id = null) => {
    const saveUrl = `${listUrl}/${id}`;
    await api.patch(saveUrl, body).then(() => { notice(saveGroupeSuccess); reloader(); }).catch(() => notice(saveError));
    return setShowListModal(false);
  };

  const onDeleteListHandler = async (id) => {
    await api.delete(`${listUrl}/${id}`)
      .then(() => { notice(deleteGroupeSuccess); reloader(); })
      .catch(() => notice(deleteError));
    return setShowListModal(false);
  };

  const onOpenModalHandler = (element) => {
    setModalTitle(element?.id ? 'Modifier la relation' : 'Ajouter une relation');
    setModalContent(
      <RelationsForm
        id={element?.id}
        forObjects={groupAccepts}
        initialForm={element || {}}
        onDelete={onDeleteElementHandler}
        onSave={onSaveElementHandler}
      />,
    );
    setShowModal(true);
  };

  // TODO:
  // What to do with relatedObject! Shared Model or Card adaptability ?
  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const structures = data.data.filter((element) => (element.relatedObject?.type === 'structure' && element.relatedObject?.currentLocalisation?.geometry?.coordinates));
    const markers = structures.map((element) => {
      const { coordinates } = element.relatedObject.currentLocalisation.geometry;
      const markersCoordinates = [...coordinates];
      const reversed = markersCoordinates.reverse();
      return ({
        latLng: reversed,
        address: `${element.relatedObject.currentName.usualName}
         ${element.relatedObject.currentLocalisation?.address},
         ${element.relatedObject.currentLocalisation?.postalCode},
         ${element.relatedObject.currentLocalisation?.locality}`,
      });
    });
    // console.log(markers);
    const list = data.data.map((element) => {
      const related = parseRelatedElement(element);
      return (
        <ModifyCard
          title={related.relatedObjectName}
          description={(
            <Row alignItems="middle" className="italic">
              <Text spacing="mr-1v mb-0">{related.relationTypeName || 'Appartient à la liste'}</Text>
              <Text spacing="mr-1v mb-0">{formatDescriptionDates(related.startDate, related.endDate)}</Text>
            </Row>
          )}
          onClick={() => onOpenModalHandler(element)}
        />
      );
    });
    if (structures.length) {
      return (
        <Row gutters>
          <Col n="12 md-6">
            <Map height="320px" markers={markers} zoom={8} />
          </Col>
          <Col n="12 md-6">
            <ScrallableListCards height="320px" cards={list} nCol="12" />
          </Col>
        </Row>
      );
    }
    return (
      <ExpendableListCards list={list} nCol="12 md-6" />
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">{groupName}</BlocTitle>
      {reloader && <BlocActionButton icon="ri-edit-line" onClick={() => setShowListModal(true)}>Editer la liste</BlocActionButton>}
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un élément</BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
      <BlocModal>
        <Modal isOpen={showListModal} size="lg" hide={() => setShowListModal(false)}>
          <ModalTitle>{`Gérer la liste '${groupName}'`}</ModalTitle>
          <ModalContent>
            <RelationsGroupForm
              id={groupId}
              initialForm={group}
              onDelete={onDeleteListHandler}
              onSave={onSaveListHandler}
            />
          </ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}

Relations.propTypes = {
  group: PropTypes.shape.isRequired,
  reloader: PropTypes.func,
};

Relations.defaultProps = {
  reloader: null,
};
