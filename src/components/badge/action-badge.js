import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function ActionBadge({
  className,
  colorFamily,
  isSmall,
  onClick,
  children,
  ...remainingProps
}) {
  const _className = classNames(
    'fr-badge',
    {
      [`fr-badge--${colorFamily}`]: colorFamily,
      'fr-badge--sm': isSmall,
    },
    className,
  );

  return (
    <button onClick={onClick} type="button" className={_className} {...remainingProps}>
      {children}
    </button>
  );
}

ActionBadge.defaultProps = {
  isSmall: false,
  className: '',
  colorFamily: 'green-menthe',
};

ActionBadge.propTypes = {
  isSmall: PropTypes.bool,
  colorFamily: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
