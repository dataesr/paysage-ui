import { useState } from 'react';
import { ButtonGroup, Modal, ModalContent, ModalTitle, Text } from '@dataesr/react-dsfr';
import EmailDomainForm from '../../forms/email-domain';
import api from '../../../utils/api';
import Button from '../../button';
import ExpendableListCards from '../../card/expendable-list-cards';
import KeyValueCard from '../../card/key-value-card';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import useUrl from '../../../hooks/useUrl';
import { deleteError, deleteSuccess, saveDuplicate, saveError, saveSuccess } from '../../../utils/notice-contents';
import { EMAIL_DOMAIN_TYPES } from './constants';

const TYPES_ORDER = Object.keys(EMAIL_DOMAIN_TYPES);

export default function EmailDomainsComponent() {
  const { id } = useUrl();
  const { viewer } = useAuth();
  const { data, isLoading, error, reload } = useFetch(`/domains?filters[structures.structureId]=${id}&limit=100`);
  const { notice } = useNotice();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const isAdmin = viewer?.role === 'admin';

  const links = (data?.data || [])
    .map((domain) => ({ domain, link: domain.structures?.find((structure) => structure.structureId === id) }))
    .sort((a, b) => (TYPES_ORDER.indexOf(a.link?.type) - TYPES_ORDER.indexOf(b.link?.type))
      || a.domain.domainName.localeCompare(b.domain.domainName));

  const onSaveHandler = async ({ domainName, type }) => {
    if (links.some(({ domain }) => domain.domainName.toLowerCase() === domainName)) {
      notice(saveDuplicate);
      return setShowModal(false);
    }
    const link = { structureId: id, type };

    await api.get(`/domains?query=${encodeURIComponent(`"${domainName}"`)}&limit=100`)
      .then(({ data: found }) => {
        const domain = found?.data?.find((item) => item.domainName.toLowerCase() === domainName);
        return domain
          ? api.post(`/domains/${domain.id}/structures`, link)
          : api.post('/domains', { domainName, structures: [link] });
      })
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onRemoveHandler = async (domainId, linkId) => {
    await api.delete(`/domains/${domainId}/structures/${linkId}`)
      .then(() => { notice(deleteSuccess); reload(); })
      .catch(() => notice(deleteError));
    return setShowModal(false);
  };

  const onOpenAddModalHandler = () => {
    setModalTitle("Ajout d'un nom de domaine email");
    setModalContent(<EmailDomainForm onSave={onSaveHandler} />);
    setShowModal(true);
  };

  const onOpenRemoveModalHandler = (domain, link) => {
    setModalTitle("Retrait d'un nom de domaine email");
    setModalContent(
      <>
        <Text>
          Le nom de domaine
          {' '}
          <strong>{domain.domainName}</strong>
          {' '}
          ne sera plus rattaché à cette structure. Il reste disponible dans Administration &gt; Noms de domaine.
        </Text>
        <ButtonGroup align="right" isInlineFrom="md">
          <Button secondary onClick={() => setShowModal(false)}>Annuler</Button>
          <Button color="error" icon="ri-delete-bin-line" onClick={() => onRemoveHandler(domain.id, link.id)}>Retirer</Button>
        </ButtonGroup>
      </>,
    );
    setShowModal(true);
  };

  const renderCards = () => {
    if (!data) return null;
    const list = links.map(({ domain, link }) => (
      <KeyValueCard
        key={domain.id}
        cardKey={EMAIL_DOMAIN_TYPES[link?.type] || 'Type non renseigné'}
        cardValue={domain.domainName}
        icon="ri-at-line"
        className="card-structures"
        inactive={domain.archived}
        onEdit={(isAdmin && link) ? () => onOpenRemoveModalHandler(domain, link) : null}
        copy
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Noms de domaine email</BlocTitle>
      {isAdmin && <BlocActionButton onClick={onOpenAddModalHandler}>Ajouter un nom de domaine</BlocActionButton>}
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
