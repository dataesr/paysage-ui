import PropTypes from 'prop-types';
import File from './file';
import { downloadFile } from '../../utils/files';

export default function Download({ file }) {
  return <File file={file} onClick={() => downloadFile(file)} />;
}

Download.propTypes = {
  file: PropTypes.shape.isRequired,
};
