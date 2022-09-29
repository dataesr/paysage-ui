/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import Button from '../button';
import useViewport from '../../hooks/useViewport';
import typeValidation from '../../utils/type-validation';

export default function BlocActionButton({ children, onClick, icon, color }) {
  const { mobile } = useViewport();
  return mobile
    ? <Button color={color} size="sm" tertiary borderless onClick={onClick} icon={icon} title={children} />
    : <Button color={color} size="sm" secondary onClick={onClick} icon={icon}>{children}</Button>;
}

BlocActionButton.propTypes = {
  __TYPE: typeValidation('BlocActionButton'),
  children: PropTypes.node,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
};

BlocActionButton.defaultProps = {
  __TYPE: 'BlocActionButton',
  children: null,
  icon: 'ri-add-circle-line',
  color: null,
};