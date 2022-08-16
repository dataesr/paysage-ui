import PropTypes from 'prop-types';

// import useFetch from '../../../hooks/useFetch';

export default function LogosComponent({ id, apiObject }) {
  return (
    <p>
      LogosComponent
      {id}
      {apiObject}
    </p>
  );
}

LogosComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
