import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@dataesr/react-dsfr';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import styles from './styles.module.scss';

function CopyBadgeButton({
  className,
  colorFamily,
  isSmall,
  text,
  lowercase,
  ...remainingProps
}) {
  const [copyStatus, copy] = useCopyToClipboard();
  const _className = classNames(
    'fr-badge',
    {
      [`${styles.lowercase}`]: lowercase,
      [`fr-badge--${colorFamily}`]: colorFamily,
      'fr-badge--sm': isSmall,
    },
    className,
  );

  const iconsType = {
    Copié: 'ri-checkbox-circle-fill',
    Erreur: 'ri-settings-6-fill',
  };

  return (
    <button onClick={() => copy(text)} type="button" className={_className} {...remainingProps}>
      <Icon
        iconPosition="right"
        verticalAlign="sub"
        name={copyStatus ? iconsType[copyStatus] : 'ri-file-copy-line'}
        size="1x"
        className="ds-fr-badge-icon"
      >
        {text}
      </Icon>
    </button>
  );
}

CopyBadgeButton.defaultProps = {
  lowercase: false,
  isSmall: false,
  className: '',
  colorFamily: 'green-menthe',
};

CopyBadgeButton.propTypes = {
  text: PropTypes.string.isRequired,
  lowercase: PropTypes.bool,
  isSmall: PropTypes.bool,
  colorFamily: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default CopyBadgeButton;
