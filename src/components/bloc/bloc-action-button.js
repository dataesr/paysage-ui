/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import Button from '../button';
import useViewport from '../../hooks/useViewport';
import typeValidation from '../../utils/type-validation';

export default function BlocActionButton({ children, onClick, icon }) {
  const { mobile } = useViewport();
  return mobile
    ? <Button size="sm" tertiary borderless onClick={onClick} icon={icon} title={children} />
    : <Button size="sm" secondary onClick={onClick} icon={icon}>{children}</Button>;
}

BlocActionButton.propTypes = {
  __TYPE: typeValidation('BlocActionButton'),
  children: PropTypes.node,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

BlocActionButton.defaultProps = {
  __TYPE: 'BlocActionButton',
  children: null,
  icon: 'ri-add-circle-line',
};
