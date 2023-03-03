import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import api from '../../../../utils/api';
import RelationCard from '../../../card/relation-card';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocFilter, BlocModal, BlocTitle } from '../../../bloc';
import RelationsForm from '../../../forms/relations';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import useNotice from '../../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../../utils/notice-contents';
import { exportToCsv, hasExport } from '../utils/exports';
import { spreadByStatus } from '../utils/status';
import BlocGouvernanceFilter from '../../../bloc/bloc-gouvernance-filter';

function getByMandateTypeGroupCounts(data) {
  if (!data?.length) return {};
  const counts = data?.reduce((a, b) => {
    const group = b?.relationType?.mandateTypeGroup;
    if (Object.keys(a)?.includes(group)) return { ...a, [group]: a[group] + 1 };
    return { ...a, [group]: 1 };
  }, {});
  return counts;
}

export default function RelationsGouvernance({ blocName, tag, resourceType, relatedObjectTypes, inverse, noRelationType, noFilters, Form, sort }) {
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
  const [typeFilter, setTypeFilter] = useState(defaultFilter);
  const mandateTypeGroupCounts = getByMandateTypeGroupCounts(spreadedByStatusRelations[statusFilter]);
  useEffect(() => setStatusFilter(defaultFilter), [defaultFilter]);
  useEffect(() => setTypeFilter(null), [statusFilter]);

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
    const byTypeRelation = typeFilter ? relations.filter((rel) => rel?.relationType?.mandateTypeGroup === typeFilter) : relations;

    const list = byTypeRelation
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

    return <ExpendableListCards max={60} list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data} isRelation>
      <BlocTitle as="h3" look="h6">{blocName || tag}</BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un élément</BlocActionButton>
      {(!noFilters) && <BlocFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} />}
      <BlocGouvernanceFilter counts={mandateTypeGroupCounts} currentFilter={typeFilter} setFilter={setTypeFilter} />
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

RelationsGouvernance.propTypes = {
  blocName: PropTypes.string,
  Form: PropTypes.func,
  inverse: PropTypes.bool,
  noRelationType: PropTypes.bool,
  noFilters: PropTypes.bool,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.string,
  sort: PropTypes.string,
  tag: PropTypes.string.isRequired,
};

RelationsGouvernance.defaultProps = {
  blocName: '',
  Form: RelationsForm,
  inverse: false,
  noRelationType: false,
  noFilters: false,
  relatedObjectTypes: ['persons', 'structures', 'prizes', 'terms', 'projects', 'categories'],
  resourceType: 'structures',
  sort: '-startDate',
};
