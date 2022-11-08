import PropTypes from 'prop-types';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import Button from '../button';

export default function CopyButton({ copyText, title, size }) {
  const [copyStatus, copy] = useCopyToClipboard();
  return (
    <Button
      tertiary
      borderless
      icon={copyStatus ? 'ri-check-double-line' : 'ri-file-copy-line'}
      rounded
      color="text"
      title={title}
      onClick={() => copy(copyText)}
      size={size}
      className="no-print"
    />
  );
}

CopyButton.propTypes = {
  title: PropTypes.string,
  copyText: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

CopyButton.defaultProps = {
  title: 'Copier',
  size: 'sm',
};
