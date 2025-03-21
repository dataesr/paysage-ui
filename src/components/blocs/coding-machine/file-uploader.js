import PropTypes from 'prop-types';

function FileUploader({ onFileUpload }) {
  return (
    <div className="fr-mb-3w">
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={onFileUpload}
        className="fr-upload"
        id="file-upload"
      />
    </div>
  );
}

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
