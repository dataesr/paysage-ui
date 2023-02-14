import { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, ModalContent, ModalTitle, Row } from '@dataesr/react-dsfr';
import api from '../../../utils/api';
import RelationCard from '../../card/relation-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import RelationsForm from '../../forms/relations';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useNotice from '../../../hooks/useNotice';
import Map from '../../map/auto-bound-map';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';
import { exportToCsv, hasExport } from './utils/exports';
import { getComparableNow } from '../../../utils/dates';

const getMarkers = (structures) => structures.map((element) => {
  const { coordinates } = element.currentLocalisation.geometry;
  const markersCoordinates = [...coordinates];
  const reversed = markersCoordinates.reverse();
  return ({
    latLng: reversed,
    address: `${element.displayName}
         ${element.currentLocalisation?.address},
         ${element.currentLocalisation?.postalCode},
         ${element.currentLocalisation?.locality}`,
  });
});

export default function RelationsByTag({ blocName, tag, resourceType, relatedObjectTypes, inverse, noRelationType, Form, sort }) {
  const queryObject = inverse ? 'relatedObjectId' : 'resourceId';
  const { notice } = useNotice();
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${tag}&filters[${queryObject}]=${resourceId}&limit=2000&sort=${sort}`;
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const onSaveElementHandler = async (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `/relations/${id}` : '/relations';
    const postBody = { ...body };
    if (inverse) {
      postBody.relatedObjectId = resourceId;
    } else {
      postBody.resourceId = resourceId;
    }
    postBody.relationTag = tag;
    await api[method](saveUrl, postBody).then(() => { notice(saveSuccess); reload(); }).catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteElementHandler = async (id) => {
    await api.delete(`/relations/${id}`).then(() => { notice(deleteSuccess); reload(); }).catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const onOpenModalHandler = (element) => {
    setModalTitle(element?.id ? 'Modifier la relation' : 'Ajouter une relation');
    setModalContent(
      <Form
        inverse={inverse}
        id={element?.id}
        resourceType={resourceType}
        relatedObjectTypes={relatedObjectTypes}
        data={element || {}}
        onDelete={onDeleteElementHandler}
        onSave={onSaveElementHandler}
        noRelationType={noRelationType}
      />,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    const relatedKey = inverse ? 'resource' : 'relatedObject';
    if (!data && !data?.data?.length) return null;
    const relatedStructures = data.data
      .filter((element) => (element[relatedKey]?.collection === 'structures'))
      .filter((element) => element[relatedKey]?.currentLocalisation?.geometry?.coordinates)
      .map((element) => element[[relatedKey]]);
    const relatedMarkers = getMarkers(relatedStructures);
    const associatedStructures = data.data
      .map((element) => element.otherAssociatedObjects)
      .filter((element) => (element?.length > 0))
      .flat()
      .filter((element) => element.collection === 'structures')
      .filter((element) => element?.currentLocalisation?.geometry?.coordinates);
    const associatedStructuresMarkers = getMarkers(associatedStructures);

    const currentRelations = data.data
      .filter((element) => (
        (element.active === true)
      || (element.endDate > getComparableNow())
      || (element.startDate > getComparableNow())
      || (element.startDate < getComparableNow() && element.endDate > getComparableNow())
      || (element.startDate < getComparableNow() && !element.endDate && element.active !== false)
      || (element.startDate === null && element.endDate === null && element.active !== false)
      )).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .sort((a, b) => ((a?.relationType?.priority || 99) - (b?.relationType?.priority || 99)));

    const activesIds = currentRelations
      .map((element) => element.id);

    const inactives = data.data.filter((element) => (!activesIds.includes(element.id)));

    const list = [...currentRelations, ...inactives].map((element) => (
      <RelationCard
        key={element.id}
        inverse={inverse}
        relation={element}
        onEdit={() => onOpenModalHandler(element)}
      />
    ));

    const markers = [...relatedMarkers, ...associatedStructuresMarkers];
    if (markers.length) {
      return (
        <Row gutters>
          <Col n="12">
            <Map height="320px" markers={markers} zoom={8} />
          </Col>
          <Col n="12">
            <ExpendableListCards list={list} nCol="6" />
          </Col>
        </Row>
      );
    }
    return (
      <ExpendableListCards list={list} nCol="12 md-6" />
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data} isRelation>
      <BlocTitle as="h3" look="h6">{blocName || tag}</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un élément</BlocActionButton>
      {hasExport({ tag, inverse }) && (
        <BlocActionButton
          icon="ri-download-line"
          edit={false}
          onClick={() => exportToCsv({
            data: data?.data,
            fileName: `${resourceId}-${tag}`,
            listName: blocName,
            tag,
            inverse,
          })}
        >
          Télécharger la liste
        </BlocActionButton>
      )}
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

RelationsByTag.propTypes = {
  blocName: PropTypes.string,
  Form: PropTypes.func,
  inverse: PropTypes.bool,
  noRelationType: PropTypes.bool,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.string,
  sort: PropTypes.string,
  tag: PropTypes.string.isRequired,
};

RelationsByTag.defaultProps = {
  blocName: '',
  Form: RelationsForm,
  inverse: false,
  noRelationType: false,
  relatedObjectTypes: ['persons', 'structures', 'prizes', 'terms', 'projects', 'categories'],
  resourceType: 'structures',
  sort: '-startDate',
};
