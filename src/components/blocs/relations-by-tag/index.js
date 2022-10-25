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

const deleteError = { content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' };
const saveError = { content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' };
const saveSuccess = { content: 'La relation a été ajoutée avec succès.', autoDismissAfter: 6000, type: 'success' };
const deleteSuccess = { content: 'La relation a été supprimée avec succès.', autoDismissAfter: 6000, type: 'success' };

export default function RelationsByTag({ blocName, tag, resourceType, relatedObjectTypes, inverse, noRelationType, Form }) {
  const queryObject = inverse ? 'relatedObjectId' : 'resourceId';
  const { notice } = useNotice();
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${tag}&filters[${queryObject}]=${resourceId}&limit=200`;
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
    const structures = data.data.filter((element) => (element[relatedKey]?.collection === 'structures' && element[relatedKey]?.currentLocalisation?.geometry?.coordinates));
    const markers = structures.map((element) => {
      const { coordinates } = element[relatedKey].currentLocalisation.geometry;
      const markersCoordinates = [...coordinates];
      const reversed = markersCoordinates.reverse();
      return ({
        latLng: reversed,
        address: `${element[relatedKey].displayName}
         ${element[relatedKey].currentLocalisation?.address},
         ${element[relatedKey].currentLocalisation?.postalCode},
         ${element[relatedKey].currentLocalisation?.locality}`,
      });
    });
    const list = data.data.map((element) => (
      <RelationCard
        inverse={inverse}
        relation={element}
        onEdit={() => onOpenModalHandler(element)}
      />
    ));
    if (structures.length) {
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
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">{blocName || tag}</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un élément</BlocActionButton>
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
  tag: PropTypes.string.isRequired,
  resourceType: PropTypes.string,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  inverse: PropTypes.bool,
  noRelationType: PropTypes.bool,
  Form: PropTypes.func,
};

RelationsByTag.defaultProps = {
  resourceType: 'structures',
  relatedObjectTypes: ['persons', 'structures', 'prices', 'terms', 'projects', 'categories'],
  inverse: false,
  noRelationType: false,
  blocName: '',
  Form: RelationsForm,
};