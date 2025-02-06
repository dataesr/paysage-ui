import PropTypes from 'prop-types';
import Button from '../../../../../components/button';
import DismissButton from './DismissButton';
import api from '../../../../../utils/api';
import useNotice from '../../../../../hooks/useNotice';

export const getPaysageValue = (paysageData) => paysageData.structureStatus;

export const getSireneValue = (update) => {
  const statusMap = {
    A: 'Active',
    F: 'Fermée',
    C: 'Cessée',
  };
  return statusMap[update.value] || update.value;
};

const okContent = (
  <>
    <p>Le statut administratif a été mis à jour</p>
    <p>La date de fin à été mise à jour</p>
  </>
);

export function EtatAdministratifUpdate({ update, paysageData, reload }) {
  const { notice } = useNotice();

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sireneValue}</span>
          <br />
          <i>{update.changeEffectiveDate}</i>
        </p>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Valeur paysage actuelle:
          </i>
          <br />
          <span className="fr-text--bold">{paysageValue || 'Non renseigné'}</span>
          <br />
          <i>{paysageData.closureDate && `Fermeture: ${paysageData.closureDate}`}</i>
        </p>
      </div>
      {(update.status === 'pending') && (
        <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
          <Button
            size="sm"
            type="button"
            onClick={async () => {
              try {
                await api.patch(
                  `/structures/${update.paysage}`,
                  { closureDate: update.changeEffectiveDate, structureStatus: 'inactive' },
                );
                await api.patch(
                  `/sirene/updates/${update._id}`,
                  { status: 'ok' },
                );
                reload();
                notice({
                  content: okContent,
                  autoDismissAfter: 6000,
                  type: 'success',
                });
              } catch {
                notice({
                  content: 'KO',
                  autoDismissAfter: 6000,
                  type: 'error',
                });
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

EtatAdministratifUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
