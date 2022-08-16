import PropTypes from 'prop-types';

// import useFetch from '../../../hooks/useFetch';

export default function CategoriesComponent({ id, apiObject }) {
  return (
    <p>
      CategoriesComponent
      {id}
      {apiObject}
    </p>
  );
}

CategoriesComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
