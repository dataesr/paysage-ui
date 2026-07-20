import { useState } from 'react';
import { ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import Modal from '../modal';
import ObjectSelector from './components/object-selector';
import PersonFlow from './persons';
import StructureFlow from './structures';
import MandateFlow from './mandates';
import OfficialTextFlow from './official-texts';

const FLOW_TITLES = {
  person: 'Personne',
  structure: 'Structure',
  mandate: 'Fonction / Mandat',
  'official-text': 'Texte officiel',
  prize: 'Prix',
};

export default function BotanicModal({ isOpen, onClose }) {
  const [objectType, setObjectType] = useState(null);

  const handleClose = () => {
    setObjectType(null);
    onClose();
  };

  const subtitle = FLOW_TITLES[objectType];

  return (
    <Modal isOpen={isOpen} size="xl" hide={handleClose}>
      <ModalTitle>{`Assistant Paysage${subtitle ? ` · ${subtitle}` : ''}`}</ModalTitle>
      <ModalContent>
        {!objectType && <ObjectSelector onSelect={setObjectType} />}
        {objectType === 'person' && <PersonFlow onClose={handleClose} />}
        {objectType === 'structure' && <StructureFlow onClose={handleClose} />}
        {objectType === 'mandate' && <MandateFlow onClose={handleClose} />}
        {objectType === 'official-text' && <OfficialTextFlow onClose={handleClose} />}
      </ModalContent>
    </Modal>
  );
}

BotanicModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
