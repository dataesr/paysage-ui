/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import typeValidation from '../../utils/type-validation';

export default function BlocModal({ children }) {
  return <div>{children}</div>;
}

BlocModal.propTypes = {
  __TYPE: typeValidation('BlocModal'),
  children: PropTypes.node,
};

BlocModal.defaultProps = {
  __TYPE: 'BlocModal',
  children: null,
};
