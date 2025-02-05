import PropTypes from 'prop-types';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import NameForm from '../../../../../components/forms/names';
import DismissButton from './DismissButton';

export const getPaysageValue = (paysageData) => (
  <>
    <span>{paysageData.displayName}</span>
    <br />
    <span className="fr-text--sm">{paysageData.currentName?.officialName}</span>
  </>
);

export const getSireneValue = (update) => update.value;
export const getSirenePrevValue = (update) => update.previousValue;

export const getForm = (update) => ({
  offcialName: update.value,
  usualName: update.value,
  startDate: update.changeEffectiveDate,
});

export function DenominationUpdate({ update, paysageData, reload }) {
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
          <NameForm
            id={update.id}
            data={getForm(update)}
            onSave={() => {
              console.log('save');
              setShowModal(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
DenominationUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
