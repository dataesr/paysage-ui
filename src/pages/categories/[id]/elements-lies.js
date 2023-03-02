import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../../components/bloc';
import { RelationsByGroup, RelationsByTag, RelationsParticipations } from '../../../components/blocs/relations';
import RelationGroupForm from '../../../components/forms/relations-group';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../../utils/notice-contents';
import {
  PERSONNE_CATEGORIE,
  PRIX_CATEGORIE,
  PROJET_CATEGORIE,
  STRUCTURE_CATEGORIE,
  TERME_CATEGORIE,
} from '../../../utils/relations-tags';

export default function CategoriesRelatedElements() {
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
      <RelationsByTag
        tag={STRUCTURE_CATEGORIE}
        blocName="Structures associées"
        resourceType="structures"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PERSONNE_CATEGORIE}
        blocName="Personnes associées"
        resourceType="persons"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PRIX_CATEGORIE}
        blocName="Prix associés"
        resourceType="prizes"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={PROJET_CATEGORIE}
        blocName="Projets associés"
        resourceType="projects"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
      <RelationsByTag
        tag={TERME_CATEGORIE}
        blocName="Termes associées"
        resourceType="terms"
        relatedObjectTypes={['categories']}
        noRelationType
        inverse
      />
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
