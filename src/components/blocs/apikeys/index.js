import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../../utils/notice-contents';
import ApiKeysList from './components/apikeys-list';
import ApiKeyForm from './components/form';

export default function ApiKeys() {
  const { data, isLoading, error, reload } = useFetch('/admin/api-keys?limit=5000');
  const [showModal, setShowModal] = useState(false);
  const { notice } = useNotice();
  const [newKey, setNewKey] = useState();

  const onSave = (body) => api.post('/admin/api-keys', body)
    .then((response) => {
      notice(saveSuccess);
      reload();
      setNewKey(response.data.id);
    })
    .catch(() => notice(saveError))
    .finally(() => setShowModal(false));

  const onDelete = (id) => api.delete(`/admin/api-keys/${id}`)
    .then(() => {
      notice(deleteSuccess);
      reload();
    })
    .catch(() => notice(deleteError))
    .finally(() => setShowModal(false));
  const apiKeys = data?.data?.map((item) => ({ ...item, user: `${item?.user?.firstName} ${item?.user?.lastName}`.trim() })) || [];
  return (
    <Bloc isLoading={isLoading} error={error} data={data} forceActionDisplay>
      <BlocTitle as="h3" look="h4">
        Clés API
      </BlocTitle>
      <BlocActionButton onClick={() => setShowModal((prev) => !prev)}>
        Ajouter une clé API
      </BlocActionButton>
      <BlocContent>
        <ApiKeysList data={apiKeys} deleteItem={onDelete} highlight={newKey} />
      </BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>Nouvelle Clé API</ModalTitle>
          <ModalContent>
            <ApiKeyForm onSave={onSave} />
          </ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
