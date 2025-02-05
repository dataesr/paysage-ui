import PropTypes from 'prop-types';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import IdentifierForm from '../../../../../components/forms/identifier';
import DismissButton from './DismissButton';

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
            id={update.id}
            data={getForm(update)}
            onSave={() => {
              console.log('save');
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
