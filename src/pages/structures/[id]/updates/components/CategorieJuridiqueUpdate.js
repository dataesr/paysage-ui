import PropTypes from 'prop-types';
import Button from '../../../../../components/button';
import DismissButton from './DismissButton';
import api from '../../../../../utils/api';
import useNotice from '../../../../../hooks/useNotice';
import useFetch from '../../../../../hooks/useFetch';

export const getPaysageValue = (paysageData) => paysageData?.legalcategory?.inseeCode;

export const getSireneValue = (update) => update.value;
export const getSirenePrevValue = (update) => update.previousValue;

export const getForm = (update) => ({
  inseeCode: update.value,
  startDate: update.changeEffectiveDate,
});

const okContent = (
  <>
    <p>La catégorie juridique a été mise à jour</p>
    <p>La date de fin de l'ancienne catégorie juridique est la date de début de validité de la nouvelle catégorie juridique</p>
  </>
);

export function CategorieJuridiqueUpdate({ update, paysageData, reload }) {
  const { notice } = useNotice();
  const { data } = useFetch(`/legal-categories?filters[inseeCode]=${update.value}`);

  const sireneValue = data?.data?.[0];
  if (!sireneValue) return null;

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sireneValue.longNameFr}</span>
          <br />
          <span className="fr-text--bold">{sireneValue.inseeCode}</span>
        </p>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Valeur paysage actuelle:
          </i>
          <br />
          <span className="fr-text--bold">{paysageData?.legalcategory?.longNameFr || 'Non renseigné'}</span>
          <br />
          <span className="fr-text--bold">{paysageData?.legalcategory?.inseeCode || 'Non renseigné'}</span>
        </p>
      </div>
      {(update.status === 'pending') && (
        <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
          <Button
            size="sm"
            type="button"
            disabled={update.value === paysageData?.legalcategory?.inseeCode}
            onClick={async () => {
              try {
                await api.patch(
                  `/relations/${paysageData.legalcategoryRelationshipId}`,
                  {
                    endDate: update.changeEffectiveDate,
                    resourceId: update.paysage,
                    relatedObjectId: paysageData.legalcategory.id,
                  },
                );
                await api.post(
                  '/relations',
                  {
                    relationTag: 'structure-categorie-juridique',
                    resourceId: update.paysage,
                    relatedObjectId: sireneValue.id,
                    startDate: update.changeEffectiveDate,
                  },
                );
                await api.patch(`/sirene/updates/${update._id}`, { status: 'ok' });
                reload();
                notice({ content: okContent, autoDismissAfter: 6000, type: 'success' });
              } catch {
                notice({ content: "Une erreur s'est produite", autoDismissAfter: 6000, type: 'error' });
              }
            }}
          >
            Mettre à jour
          </Button>
          <DismissButton id={update._id} reload={reload} />
        </div>
      )}
    </>
  );
}

CategorieJuridiqueUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
