import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@dataesr/react-dsfr';

export default function ClipboardCopy({ copyText }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      // eslint-disable-next-line no-return-await
      return await navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <span className="fr-mr-1w">{copyText}</span>
      <button onClick={handleCopyClick} type="button">
        {isCopied ? 'Copié' : <Icon className="ri-file-copy-line" />}
      </button>
    </>
  );
}

ClipboardCopy.propTypes = {
  copyText: PropTypes.string.isRequired,
};
