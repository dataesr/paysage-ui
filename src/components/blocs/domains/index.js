import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../../utils/notice-contents';
import DomainsForm from './components/form';
import DomainsList from './components/domains-list';

export default function Domains() {
  const { data, isLoading, error, reload } = useFetch('/domains?limit=5000');
  const [showModal, setShowModal] = useState(false);
  const { notice } = useNotice();

  const onSave = (body) => api.post('/domains', body)
    .then((response) => {
      if (response.ok) {
        notice(saveSuccess);
        reload();
      } else {
        notice(saveError);
      }
    })
    .catch(() => notice(saveError))
    .finally(() => setShowModal(false));

  const onDelete = (id, archive = true) => {
    if (archive) {
      return api.patch(`/domains/${id}`, { archived: true })
        .then(() => {
          notice(deleteSuccess);
          reload();
        })
        .catch(() => notice(deleteError));
    }
    return api.delete(`/domains/${id}`)
      .then(() => {
        notice(deleteSuccess);
        reload();
      })
      .catch(() => notice(deleteError));
  };

  const restore = (id) => api.patch(`/domains/${id}`, { archived: false })
    .then(() => {
      notice(deleteSuccess);
      reload();
    })
    .catch(() => notice(deleteError));

  const deleteStructure = (id, structId) => api.delete(`/domains/${id}/structures/${structId}`)
    .then(() => {
      notice(deleteSuccess);
      reload();
    })
    .catch(() => notice(deleteError));

  const addStructure = (id, body) => api.post(`/domains/${id}/structures`, body)
    .then((response) => {
      if (response.ok) {
        notice(saveSuccess);
        reload();
      } else {
        notice(saveError);
      }
    })
    .catch(() => notice(saveError));
  return (
    <Bloc isLoading={isLoading} error={error} data={data} forceActionDisplay>
      <BlocTitle as="h1" look="h4">
        Noms de domaine
      </BlocTitle>
      <BlocActionButton onClick={() => setShowModal((prev) => !prev)}>
        Ajouter un nom de domaine
      </BlocActionButton>
      <BlocContent>
        <DomainsList data={data?.data} restore={restore} deleteItem={onDelete} deleteStructure={deleteStructure} addStructure={addStructure} />
      </BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>Nouveau nom de domaine</ModalTitle>
          <ModalContent>
            <DomainsForm onSave={onSave} />
          </ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
