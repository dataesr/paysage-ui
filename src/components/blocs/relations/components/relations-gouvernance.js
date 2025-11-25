import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import api from '../../../../utils/api';
import RelationCard from '../../../card/relation-card';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocFilter, BlocModal, BlocTitle } from '../../../bloc';
import RelationsForm from '../../../forms/relations';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import useNotice from '../../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../../utils/notice-contents';
import { spreadByStatus } from '../utils/status';

export const GROUP_ORDER = [
  'Équipe de direction',
  'Gouvernance',
  'Cabinet',
  'Administration',
  'Composition des conseils',
  "Représentants de l'Etat",
  'Élus',
  'Référents thématiques',
  'Autres fonctions',
  'Référents MESR et rectorat',
];

function getByMandateTypeGroups(data) {
  if (!data?.length) return {};
  const counts = data?.reduce((a, b) => {
    const group = b?.relationType?.mandateTypeGroup;
    if (Object.keys(a)?.includes(group)) {
      return {
        ...a,
        [group]: {
          count: (a[group].count || 0) + 1,
          list: [...(a[group].list), b],
        },
      };
    }
    return { ...a, [group]: { count: 1, list: [b] } };
  }, {});
  return counts;
}

export default function RelationsGouvernance({
  blocName,
  tag,
  resourceType,
  relatedObjectTypes,
  inverse,
  noRelationType,
  noFilters,
  Form,
  sort,
  mandateTypeGroup,
}) {
  const queryObject = inverse ? 'relatedObjectId' : 'resourceId';
  const { notice } = useNotice();
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${tag}&filters[${queryObject}]=${resourceId}&limit=2000&sort=${sort}`;
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  let filteredData = data?.data;
  if (mandateTypeGroup) {
    filteredData = filteredData?.filter(
      (rel) => rel?.relationType?.mandateTypeGroup === mandateTypeGroup,
    );
  }
  const { data: spreadedByStatusRelations, counts, defaultFilter } = spreadByStatus(filteredData);
  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  const mandateTypeGroups = getByMandateTypeGroups(spreadedByStatusRelations[statusFilter]);
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
    const renderlist = (rel) => (rel ? rel
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .sort((a, b) => ((a?.relationType?.priority || 99) - (b?.relationType?.priority || 99)))
      .map((element) => (
        <RelationCard
          key={element.id}
          inverse={inverse}
          relation={element}
          onEdit={() => onOpenModalHandler(element)}
        />
      )) : []);
    const byTypeRelations = Object.entries(mandateTypeGroups).map(([name, { count, list }]) => ({ name, count, list: renderlist(list) }));
    return byTypeRelations
      .sort((a, b) => GROUP_ORDER.indexOf(a.name) - GROUP_ORDER.indexOf(b.name))
      .map((group) => (
        <ExpendableListCards max={60} list={group.list} nCol="12 md-6" />
      ));
  };
  const totalCount = counts ? counts[statusFilter] || 0 : 0;
  const blocData = { ...data, totalCount };

  return (
    <Bloc isLoading={isLoading} error={error} data={blocData} isRelation>
      <BlocFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} />
      <BlocTitle as="h2" look="h6">
        {blocName || tag}
      </BlocTitle>
      <BlocActionButton onClick={() => onOpenModalHandler()}>Ajouter un élément</BlocActionButton>
      {(!noFilters) && (
        <BlocTitle as="h2" look="h6">
          {blocName || tag}
          {mandateTypeGroup && counts && (
            <span style={{ marginLeft: '8px' }}>
              <Badge type="info" text={counts[statusFilter] || 0} />
            </span>
          )}
        </BlocTitle>
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
  mandateTypeGroup: PropTypes.string,
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
  mandateTypeGroup: '',
};
