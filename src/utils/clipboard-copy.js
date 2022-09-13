import { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon } from '@dataesr/react-dsfr';

export default function ClipboardCopy({ colorFamily, copyText, textOnClick }) {
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
        {isCopied && textOnClick ? (
          <Badge colorFamily={colorFamily} text={textOnClick} isSmall />
        ) : (
          <Icon className="ri-file-copy-line" />
        )}
      </button>
    </>
  );
}

ClipboardCopy.propTypes = {
  colorFamily: PropTypes.string,
  copyText: PropTypes.string.isRequired,
  textOnClick: PropTypes.string,
};

ClipboardCopy.defaultProps = {
  colorFamily: 'green-menthe',
  textOnClick: 'Copié',
};
