import PropTypes from 'prop-types';
import Button from '../../../../../components/button';
import DismissButton from './DismissButton';
import api from '../../../../../utils/api';
import useNotice from '../../../../../hooks/useNotice';

export const getPaysageValue = (paysageData) => paysageData.currentSiret?.value;

export const getSireneValue = (update) => update.siren + update.value;
export const getSirenePrevValue = (update) => update.siren + update.previousValue;

export const getForm = (update) => ({
  type: 'siret',
  value: update.siren + update.value,
  active: true,
  startDate: update.changeEffectiveDate,
});

const okContent = (
  <>
    <p>Le SIRET a été mis à jour</p>
    <p>La date de fin de l'ancien SIRET est la date de début de validité du nouveau SIRET</p>
  </>
);

export function NicSiegeUpdate({ update, paysageData, reload }) {
  const { notice } = useNotice();

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);
  const sirenePrevValue = getSirenePrevValue(update);

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sireneValue}</span>
          <br className="fr-mb-2w" />
          <i className="fr-text--sm">
            Ancienne valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sirenePrevValue}</span>
        </p>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Valeur paysage actuelle:
            {' '}
          </i>
          <br />
          <span className="fr-text--bold">{paysageValue || 'Non renseigné'}</span>
        </p>
      </div>
      {(update.status === 'pending') && (
        <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
          <Button
            size="sm"
            type="button"
            disabled={sireneValue === paysageValue}
            onClick={async () => {
              try {
                await api.patch(
                  `/structures/${update.paysage}/identifiers/${paysageData.currentSiret.id}`,
                  { active: false, endDate: update.changeEffectiveDate },
                );
                await api.post(
                  `/structures/${update.paysage}/identifiers`,
                  { type: 'siret', value: sireneValue, startDate: update.changeEffectiveDate },
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
NicSiegeUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
