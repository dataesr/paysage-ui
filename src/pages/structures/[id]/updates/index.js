import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import StructureSireneUpdates from './structure-sirene-updates';
import { Bloc, BlocContent, BlocTitle } from '../../../../components/bloc';

export default function StructureUpdatesPage() {
  const { id: resourceId } = useUrl();
  const { data: sirenUpdates, isLoading: isLoadingSirene, error: sireneError } = useFetch(`/sirene/updates?filters[paysage]=${resourceId}`);

  if (isLoadingSirene) return null;
  if (sirenUpdates && !sirenUpdates?.data?.[0]) return <p>Aucune mise à jour</p>;
  return (
    <Bloc noBadge hideOnEmptyView isLoading={isLoadingSirene} error={sireneError} data={sirenUpdates}>
      <BlocTitle as="h1" look="h6">
        Mises à jour Sirene
      </BlocTitle>
      <BlocContent>
        <StructureSireneUpdates structure={sirenUpdates?.data?.[0]} />
      </BlocContent>
    </Bloc>
  );
}
