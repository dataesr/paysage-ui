import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import Button from '../../button';

const getPaysageValue = (update, paysageData) => {
  const { field } = update;
  if (field === 'changementNicSiegeUniteLegale') return update.siret;
  if (field === 'changementCategorieJuridiqueUniteLegale') {
    return paysageData?.legalcategory?.inseeCode;
  }
  if (field === 'changementEtatAdministratifUniteLegale') {
    return paysageData?.structureStatus;
  }
  if (field === 'changementDenominationUniteLegale') {
    return paysageData?.displayName;
  }
  if (field === 'changementDenominationUsuelleUniteLegale') {
    return paysageData?.currentName?.usualName;
  }
  return null;
};
const getSireneValue = (update) => {
  const { field } = update;
  if (field === 'changementNicSiegeUniteLegale') return update.siren + update.value;
  return update.value;
};

const DATE_DISPLAY_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default function SireneUpdates() {
  const { data, isLoading, error } = useFetch('/sirene/updates');

  if (isLoading) {
    return null;
  }

  const updates = data?.data?.filter((structure) => structure.updates.length > 0);

  return (
    <Bloc isLoading={isLoading} error={error} data={data} forceActionDisplay>
      <BlocTitle as="h1" look="h4">
        Mises à jour Sirene
      </BlocTitle>
      <BlocContent>
        {updates?.map((structure) => (
          <div key={structure.id}>
            <a rel="noreferrer" target="_blank" href={structure?.paysageData?.href} className="fr-link fr-text--md fr-text--bold fr-mb-0">{structure?.paysageData?.displayName}</a>
            <p className="fr-card__detail fr-mb-0">
              {`Dernière modification repérée dans la base sirene le ${new Date(structure?.lastModificationDate)?.toLocaleDateString('fr', DATE_DISPLAY_OPTIONS)}`}
            </p>
            {structure.type === 'siren' && <p className="fr-card__detail fr-mb-2w">{`Suivi au niveau unité légale: ${structure?.siren}`}</p>}
            {structure.type === 'siret' && <p className="fr-card__detail fr-mb-2w">{`Suivi au niveau établissement ${structure.siret}`}</p>}
            {structure.updates.map((update) => (
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }} key={update.id}>
                  <div style={{ flexGrow: 1 }} key={update.id}>
                    <p className="fr-text--sm fr-text--bold fr-mb-1v">{`${update.field}`}</p>
                    <p className="fr-text--sm fr-mb-1v">{`Valeur sirene: ${getSireneValue(update)}`}</p>
                    <p className="fr-text--sm fr-mb-0">{`Valeur paysage: ${getPaysageValue(update, structure.paysageData)}`}</p>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      type="button"
                      tertiary
                      borderless
                    >
                      Marquer comme vérifié
                    </Button>
                  </div>
                </div>
                {!!(structure.updates.length > 0) && <hr style={{ width: '40%' }} />}
              </div>
            ))}
            {/* {structure.checks.map((update) => (
              <div key={update.id}>
                <p>{`Vérification de ${update.field}`}</p>
                <p>{`Valeur sirene: ${update.value}`}</p>
                <p>{`Date de la dernière vérification: ${update.lastChecked}`}</p>
              </div>
            ))} */}
            <hr />
          </div>
        ))}
      </BlocContent>
    </Bloc>
  );
}
