/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import typeValidation from '../../utils/type-validation';

export default function BlocContent({ children }) {
  return children;
}

BlocContent.propTypes = {
  __TYPE: typeValidation('BlocContent'),
  children: PropTypes.node,
};

BlocContent.defaultProps = {
  __TYPE: 'BlocContent',
  children: null,
};
