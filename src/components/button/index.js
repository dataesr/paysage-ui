import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@dataesr/react-dsfr';

import './button.scss';

const iconSize = {
  sm: 'lg',
  md: 'lg',
  lg: 'xl',
};

const Button = forwardRef((props, ref) => {
  const {
    size,
    secondary,
    tertiary,
    disabled,
    icon,
    iconPosition,
    children,
    className,
    submit,
    borderless,
    rounded,
    color,
    ...remainingProps
  } = props;
  const _className = classNames(
    `fr-btn--${size} fr-btn`,
    className,
    {
      'btn-text': (color === 'text'),
      'btn-error': (color === 'error'),
      'btn-success': (color === 'success'),
      'btn-icon': !children && icon,
      'btn-primary': !secondary && !tertiary,
      'fr-btn--secondary': secondary,
      'fr-btn--tertiary': tertiary && !borderless,
      'fr-btn--tertiary-no-outline': borderless,
      'btn-icon--rounded': !children && icon && rounded,
    },
  );

  const _button = (
    <button
      ref={ref}
      type={submit ? 'submit' : 'button'}
      className={_className}
      disabled={disabled}
      {...remainingProps}
    >
      {children}
    </button>
  );
  return icon ? (
    <Icon
      verticalAlign="sub"
      name={icon}
      size={iconSize[size]}
      iconPosition={(children && `${iconPosition}`) || 'center'}
    >
      {_button}
    </Icon>
  ) : _button;
});

Button.defaultProps = {
  size: 'md',
  secondary: false,
  disabled: false,
  iconPosition: 'left',
  icon: '',
  children: '',
  className: '',
  tertiary: false,
  submit: false,
  borderless: false,
  color: null,
  rounded: false,
};

Button.propTypes = {
  secondary: PropTypes.bool,
  borderless: PropTypes.bool,
  tertiary: PropTypes.bool,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['text', 'error', 'success']),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  submit: PropTypes.bool,
  rounded: PropTypes.bool,
};

export default Button;
