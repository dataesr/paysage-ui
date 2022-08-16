import PropTypes from 'prop-types';

// import useFetch from '../../../hooks/useFetch';

export default function LocalisationsComponent({ id, apiObject }) {
  return (
    <p>
      LocalisationsComponent
      {id}
      {apiObject}
    </p>
  );
}

LocalisationsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
