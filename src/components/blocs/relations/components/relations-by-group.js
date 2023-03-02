import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, ModalContent, ModalTitle, Row } from '@dataesr/react-dsfr';
import api from '../../../../utils/api';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocFilter, BlocModal, BlocTitle } from '../../../bloc';
import RelationsForm from '../../../forms/relations';
import RelationsGroupForm from '../../../forms/relations-group';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import useNotice from '../../../../hooks/useNotice';
import Map from '../../../map/auto-bound-map';
import RelationCard from '../../../card/relation-card';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../../utils/notice-contents';
import { exportToCsv, hasExport } from '../utils/exports';
import { spreadByStatus } from '../utils/status';
import { getMarkers } from '../utils/maps';

export default function RelationsByGroup({ group, reloader }) {
  const { id: groupId, name: groupName, accepts: groupAccepts } = group;
  const { notice } = useNotice();
  const { id: resourceId, apiObject } = useUrl('relations-groups');
  const url = `/relations?filters[relationsGroupId]=${groupId}&sort=relatedObject.collection&limit=10000`;
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { data: spreadedByStatusRelations, counts, defaultFilter } = spreadByStatus(data?.data);
  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  useEffect(() => setStatusFilter(defaultFilter), [defaultFilter]);

  const onSaveElementHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `/relations/${id}` : '/relations';
    await api[method](saveUrl, { ...body, resourceId, relationsGroupId: groupId })
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteElementHandler = async (id) => {
    await api.delete(`/relations/${id}`).then(() => { notice(deleteSuccess); reload(); }).catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const onSaveListHandler = async (body, id = null) => {
    const saveUrl = `/relations-groups/${id}`;
    await api.patch(saveUrl, body).then(() => { notice(saveSuccess); reloader(); }).catch(() => notice(saveError));
    return setShowListModal(false);
  };

  const onDeleteListHandler = async (id) => {
    await api.delete(`/relations-groups/${id}`)
      .then(() => { notice(deleteSuccess); reloader(); })
      .catch(() => notice(deleteError));
    return setShowListModal(false);
  };

  const onOpenModalHandler = (element) => {
    setModalTitle(element?.id ? 'Modifier la relation' : 'Ajouter une relation');
    setModalContent(
      <RelationsForm
        id={element?.id}
        resourceType={apiObject}
        relatedObjectTypes={groupAccepts}
        data={element || {}}
        onDelete={onDeleteElementHandler}
        onSave={onSaveElementHandler}
      />,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    const relations = spreadedByStatusRelations[statusFilter] || [];
    const markers = getMarkers(relations);
    const list = relations.map((element) => (
      <RelationCard
        relation={element}
        onEdit={() => onOpenModalHandler(element)}
      />
    ));
    if (markers.length) {
      return (
        <Row gutters>
          <Col n="12">
            <Map height="320px" markers={markers} zoom={8} />
          </Col>
          <Col n="12">
            <ExpendableListCards list={list} nCol="12 md-6" />
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
      {(groupAccepts?.length === 1 && hasExport({ tag: groupAccepts[0] })) && (
        <BlocActionButton
          icon="ri-download-line"
          edit={false}
          onClick={() => exportToCsv({ data: data?.data, fileName: `${resourceId}-${groupName}`, listName: groupName, tag: groupAccepts[0] })}
        >
          Télécharger la liste
        </BlocActionButton>
      )}
      <BlocFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} />
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
              data={group}
              onDelete={onDeleteListHandler}
              onSave={onSaveListHandler}
            />
          </ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}

RelationsByGroup.propTypes = {
  group: PropTypes.shape.isRequired,
  reloader: PropTypes.func,
};

RelationsByGroup.defaultProps = {
  reloader: null,
};
