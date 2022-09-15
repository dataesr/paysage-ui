import PropTypes from 'prop-types';
import { Badge, Icon } from '@dataesr/react-dsfr';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import styles from './styles.module.scss';

export default function CopyButton({ colorFamily, copyText, title }) {
  const [copyStatus, copy] = useCopyToClipboard();
  if (!copyStatus) {
    return (
      <button className={styles['copy-button']} title={title} onClick={() => copy(copyText)} type="button">
        <Icon className="ri-file-copy-line fr-m-0" size="md" />
      </button>
    );
  }
  return <Badge colorFamily={colorFamily} text={copyStatus} />;
}

CopyButton.propTypes = {
  title: PropTypes.string,
  colorFamily: PropTypes.string,
  copyText: PropTypes.string.isRequired,
};

CopyButton.defaultProps = {
  title: 'Copier',
  colorFamily: 'green-menthe',
};
