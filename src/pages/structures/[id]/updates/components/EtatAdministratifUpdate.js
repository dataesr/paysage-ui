import PropTypes from 'prop-types';
import { useState } from 'react';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import Button from '../../../../../components/button';
import Modal from '../../../../../components/modal';
import DismissButton from './DismissButton';

export const getPaysageValue = (paysageData) => paysageData.structureStatus;

export const getSireneValue = (update) => {
  const statusMap = {
    A: 'Active',
    F: 'Fermée',
    C: 'Cessée',
  };
  return statusMap[update.value] || update.value;
};

export const getForm = (update) => ({
  status: update.value === 'A' ? 'active' : 'inactive',
  startDate: update.changeEffectiveDate,
});

export function EtatAdministratifUpdate({ update, paysageData, reload }) {
  const [showModal, setShowModal] = useState(false);

  const paysageValue = getPaysageValue(paysageData);
  const sireneValue = getSireneValue(update);

  return (
    <>
      <div style={{ width: '100%', display: 'flex', gap: '2rem' }}>
        <p style={{ flex: '0 1 30%' }}>
          <i className="fr-text--sm">
            Nouvelle valeur sirene:
          </i>
          <br />
          <span className="fr-text--bold">{sireneValue}</span>
        </p>
        <p style={{ flex: '0 1 30%' }}>
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
          Modifier le statut administratif
          <br />
          <span className="fr-text--sm fr-text-mention--grey fr-text--regular">
            Cette action changera le status administratif de la structure
          </span>
        </ModalTitle>
        <ModalContent>
          <Button
            size="sm"
            type="button"
            secondary
            onClick={() => setShowModal(true)}
          >
            OK, je comprends
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}

EtatAdministratifUpdate.propTypes = {
  update: PropTypes.object.isRequired,
  paysageData: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
};
