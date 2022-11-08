import { useState } from 'react';
import { Modal, ModalTitle, ModalContent } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import RelationsByGroup from '../../../components/blocs/relations-by-group';
import { Bloc, BlocTitle, BlocActionButton, BlocContent, BlocModal } from '../../../components/bloc';
import RelationGroupForm from '../../../components/forms/relations-group';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import SupervisorsForm from '../../../components/forms/supervisors';

const deleteError = { content: "Une erreur s'est produite. L'élément n'a pas pu être supprimé", autoDismissAfter: 6000, type: 'error' };
const saveError = { content: "Une erreur s'est produite.", autoDismissAfter: 6000, type: 'error' };
const saveSuccess = { content: 'Le groupe a été ajoutée avec succès.', autoDismissAfter: 6000, type: 'success' };
const deleteSuccess = { content: 'Le groupe a été supprimée avec succès.', autoDismissAfter: 6000, type: 'success' };

export default function StructureElementLiesPage() {
  useHashScroll();
  const { url } = useUrl('relations-groups');
  const { data, isLoading, error, reload } = useFetch(`${url}?limit=500`);
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
  return (
    <>
      <RelationsByTag
        tag="structures-internes"
        blocName="Structures internes"
        resourceType="structures"
        relatedObjectTypes={['structures']}
      />
      <RelationsByTag
        tag="structures-internes"
        blocName="Structures parentes"
        resourceType="structures"
        relatedObjectTypes={['structures']}
        inverse
      />
      <RelationsByTag
        tag="predecesseurs"
        blocName="Prédécesseurs"
        resourceType="structures"
        relatedObjectTypes={['structures']}
      />
      <RelationsByTag
        tag="predecesseurs"
        blocName="Successeurs"
        resourceType="structures"
        relatedObjectTypes={['structures']}
        inverse
      />
      <RelationsByTag
        tag="structures-ministers"
        blocName="Ministres de tutelle"
        resourceType="structures"
        relatedObjectTypes={['supervising-ministers']}
        Form={SupervisorsForm}
      />
      <hr />
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h2" look="h4">Autres listes</BlocTitle>
        <BlocActionButton onClick={() => setIsOpen(true)}>Ajouter une liste</BlocActionButton>
        <BlocContent>{(data.data?.length !== 0) && data.data?.map((group) => (<RelationsByGroup key={group.id} group={group} reloader={reload} />))}</BlocContent>
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
    </>
  );
}
