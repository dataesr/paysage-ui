import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import StructureSireneUpdates from './structure-sirene-updates';
import { Bloc, BlocContent, BlocTitle } from '../../../../components/bloc';
import StructureIdentifiersUpdates from './structure-identifiers-updates';

export default function StructureUpdatesPage() {
  const { id: resourceId } = useUrl();
  const {
    data: sireneUpdates,
    isLoading: isLoadingSirene,
    error: sireneError,
    reload: reloadSirene,
  } = useFetch(`/sirene/updates?filters[paysage]=${resourceId}`);
  const {
    data: identifierUpdates,
    isLoading: isLoadingIdentifiers,
    error: identifiersError,
    reload: reloadIdentifiers,
  } = useFetch(`/structures-identifier/updates?filters[paysage]=${resourceId}`);

  if (isLoadingSirene || isLoadingIdentifiers) return null;

  const hasSireneUpdates = !!sireneUpdates?.data?.[0];
  const hasIdentifierUpdates = !!identifierUpdates?.data?.[0];

  if (!hasSireneUpdates && !hasIdentifierUpdates) return <p>Aucune mise à jour</p>;

  return (
    <>
      {hasSireneUpdates && (
        <Bloc noBadge hideOnEmptyView isLoading={isLoadingSirene} error={sireneError} data={sireneUpdates}>
          <BlocTitle as="h1" look="h6">
            Mises à jour Sirene
          </BlocTitle>
          <BlocContent>
            <StructureSireneUpdates reload={reloadSirene} structure={sireneUpdates.data[0]} />
          </BlocContent>
        </Bloc>
      )}
      {hasIdentifierUpdates && (
        <Bloc noBadge hideOnEmptyView isLoading={isLoadingIdentifiers} error={identifiersError} data={identifierUpdates}>
          <BlocTitle as="h1" look="h6">
            Mises à jour des identifiants
          </BlocTitle>
          <BlocContent>
            <StructureIdentifiersUpdates reload={reloadIdentifiers} structure={identifierUpdates.data[0]} />
          </BlocContent>
        </Bloc>
      )}
    </>
  );
}
