import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, BadgeGroup, Col, Modal, ModalContent, ModalTitle, Row, Tag, Text, Link } from '@dataesr/react-dsfr';
import useEditMode from '../../../hooks/useEditMode';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';

import api from '../../../utils/api';
import { saveError, saveSuccess, deleteError, deleteSuccess } from '../../../utils/notice-contents';

import {
  Bloc, BlocContent, BlocActionButton, BlocTitle, BlocModal,
} from '../../bloc';
import Button from '../../button';
import { Download } from '../../download';
import DocumentForm from '../../forms/documents';
import useAuth from '../../../hooks/useAuth';
import TagList from '../../tag-list';

export default function DocumentsOutlet() {
  const { editMode } = useEditMode();
  const { viewer } = useAuth();
  const { id: resourceId } = useParams();
  const navigate = useNavigate();
  const url = `/documents?filters[relatesTo]=${resourceId}&sort=-startDate&limit=500`;
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalContent, setModalContent] = useState(null);

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
    // Transform relatedObjects to use as managment value inside the form
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

  const renderGroupBadge = (canAccess = []) => {
    if (!canAccess?.length > 0) return null;
    const { groups } = viewer;
    const accessGroups = groups.filter((elem) => (canAccess.includes(elem.id)));
    if (accessGroups.length > 0) {
      return accessGroups.map((group) => <Badge key={group.id} type="success" iconPosition="right" icon="ri-lock-unlock-line" text={group.acronym || group.name} />);
    }
    return null;
  };

  const renderContent = () => {
    if (!data || !data.data.length) return null;
    return (
      <Row gutters>
        {data.data.map((document) => (
          <Col n="12 md-6" key={document.id}>
            <div className="fr-card fr-card--xs fr-card--shadow">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <div className="fr-card__start">
                    <Row className="flex--space-between">
                      <BadgeGroup>
                        {renderGroupBadge(document.canAccess)}
                      </BadgeGroup>
                      {editMode && <Button onClick={() => onOpenModalHandler(document)} className="edit-button" icon="ri-edit-line" title="Editer le document" tertiary borderless rounded />}
                    </Row>
                  </div>
                  <p className="fr-card__title">{document.title}</p>
                  <Row className="fr-card__desc">
                    <BadgeGroup className="fr-mt-1v">
                      <Badge text={document.documentType?.usualName} />
                      <Badge type="info" text={document.startDate?.slice(0, 4)} />
                    </BadgeGroup>
                  </Row>
                  {document.description && <div className="fr-card__desc">{document.description}</div>}
                  <div className="fr-card__end">
                    {(document.relatedObjects.length > 1) && <Text spacing="mb-1w" bold>Autres objets associés :</Text>}
                    {document.documentUrl && (
                      <Row>
                        <Col className="fr-pb-1w">
                          <Link target="_blank" href={document.documentUrl} rel="noreferrer">
                            Lien vers le document
                          </Link>
                        </Col>
                      </Row>
                    )}
                    {document.relatedObjects && (
                      <TagList maxTags={2}>
                        {document.relatedObjects
                          .filter((related) => (related.id !== resourceId))
                          .map((related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>)}
                      </TagList>
                    )}
                    <Row>
                      {document.files.map((file) => (<Download key={file.url} file={file} />
                      ))}
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
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
  );
}
