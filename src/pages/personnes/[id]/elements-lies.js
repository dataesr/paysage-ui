import { useState } from 'react';
import { Modal, ModalTitle, ModalContent } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { RelationsByGroup, RelationsParticipations } from '../../../components/blocs/relations';
import { Bloc, BlocTitle, BlocActionButton, BlocContent, BlocModal } from '../../../components/bloc';
import RelationGroupForm from '../../../components/forms/relations-group';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';

const deleteError = { content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' };
const saveError = { content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' };
const saveSuccess = { content: 'Le groupe a été ajoutée avec succès.', autoDismissAfter: 6000, type: 'success' };
const deleteSuccess = { content: 'Le groupe a été supprimée avec succès.', autoDismissAfter: 6000, type: 'success' };

export default function PersonsRelatedElements() {
  const { id: resourceId } = useUrl();
  const { data, isLoading, error, reload } = useFetch(`/relations-groups?filters[resourceId]=${resourceId}&limit=500`);
  const [isOpen, setIsOpen] = useState();
  const { notice } = useNotice();

  const handleDelete = async (id) => {
    if (!id) return;
    await api.delete(`/relations-groups/${id}`)
      .then(() => { reload(); notice(deleteSuccess); })
      .catch(() => notice(deleteError));
    setIsOpen(false);
  };
  const handleSave = async (body) => {
    await api.post('/relations-groups', body)
      .then(() => { reload(); notice(saveSuccess); })
      .catch(() => notice(saveError));
    setIsOpen(false);
  };

  return (
    <>
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h2" look="h4">Autres éléments liés</BlocTitle>
        <BlocActionButton onClick={() => setIsOpen(true)}>Ajouter une liste</BlocActionButton>
        <BlocContent>{data?.data?.map((group) => (<RelationsByGroup key={group.id} group={group} reloader={reload} />))}</BlocContent>
        <BlocModal>
          <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
            <ModalTitle>Ajouter un groupe d'éléments liés</ModalTitle>
            <ModalContent>
              <RelationGroupForm
                onDelete={handleDelete}
                onSave={handleSave}
                data={{ priority: 99, accepts: [], resourceId }}
              />
            </ModalContent>
          </Modal>
        </BlocModal>
      </Bloc>
      <hr />
      <RelationsParticipations />
    </>
  );
}
