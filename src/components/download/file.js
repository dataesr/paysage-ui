import PropTypes from 'prop-types';
import { Col, Icon } from '@dataesr/react-dsfr';
import { formatBytes } from '../../utils/files';
import styles from './styles.module.scss';

const getFileType = (mimetype) => {
  if (/^image\//.test(mimetype)) return 'image';
  if (mimetype === 'text/csv') return 'excel';
  if (/^text\//.test(mimetype)) return 'texte';
  if (/^audio\//.test(mimetype)) return 'audio';
  if (/^video\//.test(mimetype)) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  if (/ms-?word/.test(mimetype)) return 'document';
  if (mimetype === 'application/vnd.oasis.opendocument.text') return 'document';
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'document';
  if (/ms-?powerpoint/.test(mimetype)) return 'powerpoint';
  if (mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'powerpoint';
  if (/ms-?excel/.test(mimetype)) return 'excel';
  if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'excel';
  if (/^application\/x-(g?tar|xz|compress|bzip2|g?zip)$/.test(mimetype)) return 'archive';
  if (/^application\/x-(7z|rar|zip)-compressed$/.test(mimetype)) return 'archive';
  if (/^application\/(zip|gzip|tar)$/.test(mimetype)) return 'archive';
  return 'fichier';
};

const mapping = {
  fichier: { icon: 'ri-file-fill', color: 'var(--grey-main-525)' },
  image: { icon: 'ri-image-2-fill', color: 'var(--green-archipel-main-557)' },
  texte: { icon: 'ri-file-text-fill', color: 'var(--grey-main-525)' },
  audio: { icon: 'ri-mv-fill', color: 'var(--grey-main-525)' },
  video: { icon: 'ri-video-fill', color: 'var(--grey-main-525)' },
  pdf: { icon: 'ri-file-pdf-fill', color: 'var(--error-main-525)' },
  document: { icon: 'ri-file-word-fill', color: 'var(--blue-ecume-main-400)' },
  powerpoint: { icon: 'ri-file-ppt-fill', color: 'var(--grey-main-525)' },
  excel: { icon: 'ri-file-excel-fill', color: 'var(--green-emeraude-main-632)' },
  archive: { icon: 'ri-file-zip-fill', color: 'var(--grey-main-525)' },
};

const getFileIcon = (mimetype) => {
  const type = getFileType(mimetype);
  const { icon, color } = mapping[type];
  return <Icon className="fr-pt-1v" name={icon} size="lg" color={color} />;
};

export default function File({ file, onClick }) {
  const displayName = (file.originalName?.length < 30)
    ? file.originalName
    : `${file.originalName?.substring(0, 25)}...`;
  return (
    <Col n="12" className={styles['file-wrapper']}>
      {getFileIcon(file.mimetype)}
      <div className={styles['file-text-wrapper']}>
        {onClick
          ? (
            <div>
              <button onClick={onClick} type="button" className={styles['file-download-button']}>
                {displayName}
                <Icon name="ri-download-line" iconPosition="right" />
              </button>
              <p className={styles['file-details']}>
                {`${formatBytes(file.size)} -- ${getFileType(file.mimetype)}`}
              </p>
            </div>
          )
          : (
            <div>
              <p className="fr-mb-0">
                {displayName}
              </p>
              <p className={styles['file-details']}>
                {`${formatBytes(file.size)} -- ${getFileType(file.mimetype)}`}
              </p>
            </div>
          )}
      </div>
    </Col>
  );
}

File.propTypes = {
  file: PropTypes.shape.isRequired,
  onClick: PropTypes.func,
};

File.defaultProps = {
  onClick: null,
};
