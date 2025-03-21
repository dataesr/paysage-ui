import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextInput } from '@dataesr/react-dsfr';

function TextPasteArea({ onDataPaste }) {
  const [pastedText, setPastedText] = useState('');

  const handleTextChange = (e) => {
    setPastedText(e.target.value);
  };

  const handleProcessClick = () => {
    if (pastedText.trim()) {
      onDataPaste(pastedText);
    }
  };

  return (
    <div className="fr-mb-3w">
      <TextInput
        textarea
        label="Collez votre tableau ici"
        hint="Copiez les données depuis Excel ou un autre tableur et collez-les ici"
        onChange={handleTextChange}
        value={pastedText}
        rows={10}
      />
      <Button
        onClick={handleProcessClick}
        disabled={!pastedText.trim()}
        className="fr-mt-2w"
      >
        Traiter les données
      </Button>
    </div>
  );
}

TextPasteArea.propTypes = {
  onDataPaste: PropTypes.func.isRequired,
};

export default TextPasteArea;
