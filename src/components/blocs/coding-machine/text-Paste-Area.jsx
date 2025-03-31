import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@dataesr/react-dsfr';

function TextPasteArea({ onChange }) {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="fr-mb-2w">
      <TextInput
        textarea
        label="Collez votre tableau ici"
        hint="Copiez les données depuis Excel ou un autre tableur et collez-les ici"
        onChange={handleTextChange}
        value={text}
        rows={10}
      />
    </div>
  );
}

TextPasteArea.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default TextPasteArea;
