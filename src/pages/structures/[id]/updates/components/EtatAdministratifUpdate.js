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

// Sirene reports three different events:
// - 'A' with no previous state. first period;
// - 'A' after 'F' or 'C' is a reopening;
// - 'F' or 'C' is a closure.
export const getChangeKind = (update) => {
  if (update.value !== 'A') return 'closure';
  return update.previousValue ? 'reopening' : 'creation';
};

const CHANGE_LABELS = {
  creation: 'Création',
  reopening: 'Réouverture',
  closure: 'Fermeture',
};

async function applyCreation(update) {
  await api.patch(`/structures/${update.paysage}`, { creationDate: update.changeEffectiveDate });
  return <p>La date de création a été mise à jour</p>;
}

async function applyReopening(update) {
  await api.patch(`/structures/${update.paysage}`, { closureDate: null, structureStatus: 'active' });
  return (
    <>
      <p>La structure est de nouveau active et sa date de fermeture a été retirée</p>
      <p>Vérifiez l'identifiant Siret, il n'a pas été modifié</p>
    </>
  );
}

async function applyClosure(update, paysageData) {
  await api.patch(
    `/structures/${update.paysage}`,
    { closureDate: update.changeEffectiveDate, structureStatus: 'inactive' },
  );
  if (paysageData.currentSiret?.id) {
    await api.patch(
      `/structures/${update.paysage}/identifiers/${paysageData.currentSiret.id}`,
      { active: false, endDate: update.changeEffectiveDate },
    );
  }
  return (
    <>
      <p>Le statut administratif a été mis à jour</p>
      <p>La date de fin à été mise à jour</p>
    </>
  );
}

const APPLY = {
  creation: applyCreation,
  reopening: applyReopening,
  closure: applyClosure,
};

export function EtatAdministratifUpdate({ update, paysageData, reload }) {
  const { notice } = useNotice();

  const changeKind = getChangeKind(update);
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
          <i>{`${CHANGE_LABELS[changeKind]}: ${update.changeEffectiveDate}`}</i>
        </p>
        <p style={{ flex: '0 1 100%' }}>
          <i className="fr-text--sm">
            Valeur paysage actuelle:
          </i>
          <br />
          <span className="fr-text--bold">{paysageValue || 'Non renseigné'}</span>
          <br />
          {changeKind === 'creation'
            ? <i>{`Création: ${paysageData.creationDate || 'non renseignée'}`}</i>
            : <i>{paysageData.closureDate && `Fermeture: ${paysageData.closureDate}`}</i>}
        </p>
      </div>
      {(update.status === 'pending') && (
        <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
          <Button
            size="sm"
            type="button"
            onClick={async () => {
              try {
                const okContent = await APPLY[changeKind](update, paysageData);
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
