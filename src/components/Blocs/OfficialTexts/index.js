import PropTypes from 'prop-types';

// import useFetch from '../../../hooks/useFetch';

export default function OfficialTextsComponent({ id, apiObject }) {
  return (
    <p>
      OfficialTextsComponent
      {id}
      {apiObject}
    </p>
  );
}

OfficialTextsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
