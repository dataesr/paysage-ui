import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalTitle, Row, Tabs, Tab, Col } from '@dataesr/react-dsfr';
import api from '../../../../utils/api';
import RelationCard from '../../../card/relation-card';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../../bloc';
import BlocFilter from '../../../bloc/bloc-filter';
import RelationsForm from '../../../forms/relations';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import useNotice from '../../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../../utils/notice-contents';
import { spreadByStatus } from '../utils/status';
import { exportToCsv, hasExport } from '../utils/exports';

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

function RelationsGouvernanceGroup({
  blocName,
  tag,
  inverse,
  mandateTypeGroup,
  statusFilter,
  data,
  isLoading,
  error,
  onOpenModalHandler,
}) {
  let filteredData = data?.data;
  if (mandateTypeGroup) {
    filteredData = filteredData?.filter(
      (rel) => rel?.relationType?.mandateTypeGroup === mandateTypeGroup,
    );
  }
  const { data: spreadedByStatusRelations, counts } = spreadByStatus(filteredData);
  const mandateTypeGroups = getByMandateTypeGroups(spreadedByStatusRelations[statusFilter]);

  const renderCards = () => {
    const renderlist = (rel) => (rel ? rel
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .sort((a, b) => ((a?.relationType?.priority || 99) - (b?.relationType?.priority || 99)))
      .map((element) => (
        <Row gutters className="fr-mt-2w" key={element.id}>
          <RelationCard
            inverse={inverse}
            relation={element}
            onEdit={() => onOpenModalHandler(element)}
          />
        </Row>
      )) : []);
    const byTypeRelations = Object.entries(mandateTypeGroups).map(([name, { count, list }]) => ({ name, count, list: renderlist(list) }));
    return byTypeRelations
      .sort((a, b) => GROUP_ORDER.indexOf(a.name) - GROUP_ORDER.indexOf(b.name))
      .map((group) => (
        <ExpendableListCards key={group.name} max={60} list={group.list} nCol="12 md-6" />
      ));
  };

  const totalCount = counts ? counts[statusFilter] || 0 : 0;
  const blocData = { ...data, totalCount };

  return (
    <Bloc isLoading={isLoading} error={error} data={blocData} isRelation>
      <BlocTitle as="h2" look="h6">
        {blocName || tag}
      </BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}

RelationsGouvernanceGroup.propTypes = {
  blocName: PropTypes.string,
  tag: PropTypes.string.isRequired,
  inverse: PropTypes.bool,
  mandateTypeGroup: PropTypes.string,
  statusFilter: PropTypes.string.isRequired,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.bool,
  onOpenModalHandler: PropTypes.func.isRequired,
};

RelationsGouvernanceGroup.defaultProps = {
  blocName: null,
  inverse: false,
  mandateTypeGroup: null,
  data: {},
  isLoading: false,
  error: false,
};

export default function RelationsGouvernance({
  tag,
  resourceType,
  relatedObjectTypes,
  inverse,
  noRelationType,
  Form,
  sort,
  ExtraTab,
}) {
  const queryObject = inverse ? 'relatedObjectId' : 'resourceId';
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${tag}&filters[${queryObject}]=${resourceId}&limit=2000&sort=${sort}`;
  const { data, isLoading, error, reload } = useFetch(url);

  const { counts, defaultFilter } = spreadByStatus(data?.data);
  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  const { notice } = useNotice();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    setStatusFilter(defaultFilter);
  }, [defaultFilter]);

  const allMandateTypeGroups = new Set(data?.data
    ?.map((rel) => rel?.relationType?.mandateTypeGroup)
    .filter(Boolean));

  const sortedGroups = GROUP_ORDER.filter((group) => allMandateTypeGroups.has(group));

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
  return (
    <Bloc data={data} isRelation forceContentDisplay noBadge>
      <BlocFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        counts={counts}
        label="Relations"
      />
      {hasExport({ tag, inverse }) && (
        <BlocActionButton
          icon="ri-download-line"
          edit={false}
          onClick={() => exportToCsv({
            data: data?.data,
            fileName: `${resourceId}-${tag}`,
            listName: 'Gouvernance',
            tag,
            inverse,
          })}
        >
          Télécharger la liste
        </BlocActionButton>
      )}
      <BlocActionButton edit onClick={() => onOpenModalHandler()}>
        Ajouter un élément
      </BlocActionButton>
      <BlocContent>
        <Row gutters>
          <Tabs className="fr-mt-3w">
            {sortedGroups.map((group) => (
              <Tab
                key={group}
                label={group}
                className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border"
              >
                <Row style={{ overflowY: 'scroll' }}>
                  <Col n="12">
                    <RelationsGouvernanceGroup
                      tag={tag}
                      blocName={group}
                      inverse={inverse}
                      mandateTypeGroup={group}
                      statusFilter={statusFilter}
                      data={data}
                      isLoading={isLoading}
                      error={error}
                      onOpenModalHandler={onOpenModalHandler}
                    />
                  </Col>
                </Row>
              </Tab>
            ))}
            {ExtraTab && (
              <Tab
                label={ExtraTab.label}
                className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border"
              >
                <Row style={{ overflowY: 'scroll' }}>
                  <Col n="12">
                    {ExtraTab.component}
                  </Col>
                </Row>
              </Tab>
            )}
          </Tabs>
        </Row>
      </BlocContent>
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
  Form: PropTypes.func,
  inverse: PropTypes.bool,
  noRelationType: PropTypes.bool,
  relatedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.string,
  sort: PropTypes.string,
  tag: PropTypes.string.isRequired,
  ExtraTab: PropTypes.shape({
    label: PropTypes.string.isRequired,
    component: PropTypes.node.isRequired,
  }),
};

RelationsGouvernance.defaultProps = {
  Form: RelationsForm,
  inverse: false,
  noRelationType: false,
  relatedObjectTypes: ['persons', 'structures', 'prizes', 'terms', 'projects', 'categories'],
  resourceType: 'structures',
  sort: '-startDate',
  ExtraTab: null,
};
