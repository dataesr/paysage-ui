import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, ModalContent, ModalTitle, Row } from '@dataesr/react-dsfr';
import api from '../../../../utils/api';
import RelationCard from '../../../card/relation-card';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocFilter, BlocModal, BlocTitle } from '../../../bloc';
import RelationsForm from '../../../forms/relations';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import useNotice from '../../../../hooks/useNotice';
import Map from '../../../map';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../../utils/notice-contents';
import { exportToCsv, hasExport } from '../utils/exports';
import { spreadByStatus } from '../utils/status';
import { getMarkers } from '../utils/maps';

export default function RelationsByTag({ blocName, tag, resourceType, relatedObjectTypes, inverse, noRelationType, noFilters, Form, sort, max }) {
  const queryObject = inverse ? 'relatedObjectId' : 'resourceId';
  const { notice } = useNotice();
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${tag}&filters[${queryObject}]=${resourceId}&limit=2000&sort=${sort}`;
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { data: spreadedByStatusRelations, counts, defaultFilter } = spreadByStatus(data?.data);
  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  useEffect(() => setStatusFilter(defaultFilter), [defaultFilter]);

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
    const relations = spreadedByStatusRelations[statusFilter] || [];
    const markers = getMarkers(relations, inverse);

    const list = relations
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .sort((a, b) => ((a?.relationType?.priority || 99) - (b?.relationType?.priority || 99)))
      .map((element) => (
        <RelationCard
          key={element.id}
          inverse={inverse}
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
            {max ? <ExpendableListCards list={list.slice(0, max)} nCol="6" />
              : <ExpendableListCards list={list} nCol="6" />}
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
      {(!noFilters) && <BlocFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} />}
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
  max: PropTypes.number,
  noRelationType: PropTypes.bool,
  noFilters: PropTypes.bool,
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
  noFilters: false,
  max: null,
  relatedObjectTypes: ['persons', 'structures', 'prizes', 'terms', 'projects', 'categories'],
  resourceType: 'structures',
  sort: '-startDate',
};
