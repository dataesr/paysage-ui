import PropTypes from 'prop-types';

// import useFetch from '../../../hooks/useFetch';

export default function NamesComponent({ id, apiObject }) {
  return (
    <p>
      NamesComponent
      {id}
      {apiObject}
    </p>
  );
}

NamesComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
