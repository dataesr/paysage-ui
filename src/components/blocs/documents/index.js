import { Col, Modal, ModalContent, ModalTitle, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../../utils/notice-contents';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import DocumentCard from '../../card/document-card';
import DocumentForm from '../../forms/documents';
import WeblinksResources from './weblinks-resources';

export default function DocumentsOutlet() {
  const { id: resourceId, apiObject } = useUrl();
  const url = `/documents?filters[relatesTo]=${resourceId}&sort=-startDate&limit=500`;
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const saveDocument = (body, id = null) => {
    const method = id ? 'patch' : 'post';
    const saveUrl = id ? `/documents/${id}` : '/documents';
    api[method](saveUrl, body)
      .then(() => { reload(); notice(saveSuccess); setIsOpen(false); })
      .catch(() => notice(saveError));
  };

  const deleteDocument = (id) => api.delete(`/documents/${id}`)
    .then(() => { reload(); notice(deleteSuccess); setIsOpen(false); })
    .catch(() => notice(deleteError));

  const onOpenModalHandler = (element) => {
    const relatedObjects = element?.relatedObjects?.length
      ? element?.relatedObjects.filter((rel) => rel.id !== resourceId)
      : [];
    setModalTitle(element?.id ? 'Modifier le document' : 'Ajouter un document');
    setModalContent(
      <DocumentForm
        id={element?.id}
        data={element?.id ? { ...element, relatedObjects, currentObjectId: resourceId } : { currentObjectId: resourceId }}
        onDelete={deleteDocument}
        onSave={saveDocument}
      />,
    );
    setIsOpen(true);
  };

  const handleFilter = (type) => {
    setFilterType((prevFilterType) => (prevFilterType === type ? null : type));
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
    setFilterType(null);
  };

  const renderContent = () => {
    if (!data || !data?.data?.length) return null;

    const uniqueTypes = [...new Set(data.data.map((document) => document.documentType.usualName))];
    const typesToDisplay = showMore ? uniqueTypes : uniqueTypes.slice(0, 5);

    return (
      <>
        <Row gutters>
          <Col>
            <Row alignItems="middle" spacing="mb-1v">
              <Text className="fr-m-0" size="sm" as="span"><i>Filtrer par type de document :</i></Text>
            </Row>
            <TagGroup>
              {typesToDisplay.map((type) => (
                <Tag
                  className="no-span"
                  onClick={() => handleFilter(type)}
                  selected={filterType === type}
                >
                  {type}
                  {' '}
                  (
                  {data.data.filter((doc) => doc.documentType.usualName === type).length}
                  )
                </Tag>
              ))}
              <Tag
                onClick={handleShowMore}
                colorFamily="brown-caramel"
              >
                {showMore ? 'Voir moins de types' : 'Voir plus de types'}
              </Tag>
            </TagGroup>
          </Col>
        </Row>
        <Row gutters>
          {filterType
            ? data.data
              .filter((document) => document.documentType.usualName === filterType)
              .map((document) => (
                <DocumentCard key={document?.id} document={document} onEdit={onOpenModalHandler} />
              ))
            : data.data.map((document) => (
              <DocumentCard key={document?.id} document={document} onEdit={onOpenModalHandler} />
            ))}
        </Row>
      </>
    );
  };

  return (
    <>
      {(apiObject === 'structures') && <WeblinksResources resourceId={resourceId} />}
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h2" look="h6">Documents</BlocTitle>
        <BlocActionButton onClick={() => onOpenModalHandler()}>
          Ajouter un document
        </BlocActionButton>
        <BlocContent>{renderContent()}</BlocContent>
        <BlocModal>
          <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
            <ModalTitle>{modalTitle}</ModalTitle>
            <ModalContent>{modalContent}</ModalContent>
          </Modal>
        </BlocModal>
      </Bloc>
    </>
  );
}
