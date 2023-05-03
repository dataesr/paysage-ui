import PropTypes from 'prop-types';

export default function Info({ label, value, isCode = false }) {
  return (
    <>
      <p className="fr-text--bold fr-text--sm fr-m-0">
        {label}
      </p>
      {(isCode)
        ? <pre className="fr-m-0 fr-text--sm fr-text--bold fr-card__detail fr-pb-1w job-code">{JSON.stringify(value, null, 2)}</pre>
        : value}
    </>
  );
}
Info.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  isCode: PropTypes.bool,
};
Info.defaultProps = {
  value: null,
  isCode: false,
};
