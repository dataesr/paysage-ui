import { useState } from 'react';
import { Modal, ModalTitle, ModalContent } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useBlocUrl';
import useHashScroll from '../../../hooks/useHashScroll';
import Spinner from '../../../components/spinner';
import RelationGroup from '../../../components/blocs/relation-group';
import { Bloc, BlocTitle, BlocActionButton, BlocContent, BlocModal } from '../../../components/bloc';
import RelationsGroupForm from '../../../components/forms/relations-group';

export default function StructureElementLiesPage() {
  useHashScroll();
  const url = useUrl();
  const { data, isLoading, error } = useFetch(`${url}/relations-groups?filters[name][$nin]=Gouvernance&filters[name][$nin]=Référents MESR&filters[name][$nin]=Catégories&limit=50`);
  const [isOpen, setIsOpen] = useState();

  const handleDelete = () => {};
  const handleSave = () => {};
  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  if (data && data.data) {
    const internalStructuresGroup = data.data.find((element) => (element.name === 'Structures internes'));
    const otherGroups = data.data.filter((element) => (element.name !== 'Structures internes'));
    const renderBlocs = () => (
      <>
        {internalStructuresGroup?.id && <RelationGroup groupId={internalStructuresGroup.id} groupName={internalStructuresGroup.name} groupAccepts={internalStructuresGroup.accepts} />}
        {otherGroups?.length && otherGroups?.map((group) => (<RelationGroup key={group.id} groupId={group.id} groupName={group.name} groupAccepts={group.accepts} />))}
      </>
    );
    return (
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h2" look="h4">Eléments liés</BlocTitle>
        <BlocActionButton onClick={() => setIsOpen(true)}>Ajouter une liste</BlocActionButton>
        <BlocContent>{renderBlocs()}</BlocContent>
        <BlocModal>
          <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
            <ModalTitle>Ajouter un </ModalTitle>
            <ModalContent>
              <RelationsGroupForm
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
