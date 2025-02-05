import PropTypes from 'prop-types';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import IdentifierForm from '../../../../../components/forms/identifier';
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

export function NicSiegeUpdate({ update, paysageData, reload }) {
  const [showModal, setShowModal] = useState(false);
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
        </p>
        <p style={{ flex: '0 1 100%' }}>
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
      <div className="fr-my-2w fr-btns-group fr-btns-group--inline-sm fr-btns-group--sm">
        <Button
          size="sm"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Ajouter
        </Button>
        <DismissButton id={update._id} reload={reload} />
      </div>

      <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
        <ModalTitle>
          Modifier le SIRET
          <br />
          <span className="fr-text--sm fr-text-mention--grey fr-text--regular">
            Cette action mettra une date de fin au SIRET actuel
          </span>
        </ModalTitle>
        <ModalContent>
          <IdentifierForm
            data={getForm(update)}
            onSave={async (body) => {
              try {
                await api.patch(
                  `/structures/${update.paysage}/identifiers/${paysageData.currentSiret.id}`,
                  { active: false, endDate: update.changeEffectiveDate },
                );
                await api.post(`/structures/${update.paysage}/identifiers`, body);
                await api.patch(`/sirene/updates/${update._id}`, { status: 'ok' });
                reload();
                notice({ content: 'OK', autoDismissAfter: 6000, type: 'success' });
              } catch {
                notice({ content: 'KO', autoDismissAfter: 6000, type: 'error' });
              }
              setShowModal(false);
            }}
            options={[{
              label: 'siret',
              value: 'siret',
            }]}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
NicSiegeUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
