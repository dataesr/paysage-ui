import PropTypes from 'prop-types';

// import useFetch from '../../../hooks/useFetch';

export default function DocumentsComponent({ id, apiObject }) {
  return (
    <p>
      DocumentsComponent
      {id}
      {apiObject}
    </p>
  );
}

DocumentsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
