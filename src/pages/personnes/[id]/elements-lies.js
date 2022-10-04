import { useState } from 'react';
import { Modal, ModalTitle, ModalContent } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import Relations from '../../../components/blocs/relations';
import { Bloc, BlocTitle, BlocActionButton, BlocContent, BlocModal } from '../../../components/bloc';
import RelationGroupForm from '../../../components/forms/relations-group';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';

const deleteError = { content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' };
const saveError = { content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' };
const saveSuccess = { content: 'Le groupe a été ajoutée avec succès.', autoDismissAfter: 6000, type: 'success' };
const deleteSuccess = { content: 'Le groupe a été supprimée avec succès.', autoDismissAfter: 6000, type: 'success' };

export default function PersonnesElementLiesPage() {
  useHashScroll();
  const { url } = useUrl('relations-groups');
  const { data, isLoading, error, reload } = useFetch(`${url}?filters[name][$nin]=Catégories&limit=50`);
  const [isOpen, setIsOpen] = useState();
  const notice = useNotice();

  const handleDelete = async (id) => {
    if (!id) return;
    await api.delete(`${url}/${id}`)
      .then(() => { reload(); notice(deleteSuccess); })
      .catch(() => notice(deleteError));
    setIsOpen(false);
  };
  const handleSave = async (body) => {
    await api.post(url, body)
      .then(() => { reload(); notice(saveSuccess); })
      .catch(() => notice(saveError));
    setIsOpen(false);
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    return (
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h2" look="h4">Eléments liés</BlocTitle>
        <BlocActionButton onClick={() => setIsOpen(true)}>Ajouter une liste</BlocActionButton>
        <BlocContent>
          {(data.data?.length !== 0) && data.data?.map((group) => (<Relations key={group.id} group={group} reloader={reload} />))}
        </BlocContent>
        <BlocModal>
          <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
            <ModalTitle>Ajouter un groupe d'éléments liés</ModalTitle>
            <ModalContent>
              <RelationGroupForm
                onDelete={handleDelete}
                onSave={handleSave}
              />
            </ModalContent>
          </Modal>
        </BlocModal>
      </Bloc>
    );
  }
  return null;
}
