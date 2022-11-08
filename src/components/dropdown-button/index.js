import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Link } from '@dataesr/react-dsfr';
import Button from '../button';
import styles from './styles.module.scss';

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler],
  );
}

export function DropdownButton({
  children, className, title, align, ...remainingProps
}) {
  const id = useRef(uuidv4());
  const listRef = useRef();
  const buttonRef = useRef();
  const [isExpanded, setIsExpanded] = useState(false);
  const close = useCallback((e) => {
    if ((buttonRef?.current !== e.target) && isExpanded) {
      setIsExpanded(false);
    }
  }, [isExpanded]);
  useOnClickOutside(listRef, close);

  return (
    <div className="fr-nav">
      <div className={styles.dropdown}>
        <Button
          ref={buttonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          tertiary
          borderless
          rounded
          icon="ri-more-2-fill"
          aria-controls={id.current}
          aria-expanded={!!isExpanded}
          title={title}
          {...remainingProps}
        />
        <div ref={listRef} className={`${styles.menu} ${(align === 'right') ? styles['align-right'] : ''} ${isExpanded ? 'fr-collapse--expanded' : 'fr-collapse'}`} id={id.current}>
          <ul className={`${styles['dropdown-list']} fr-menu__list`}>
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
}
DropdownButton.defaultProps = {
  className: '',
  title: 'Options',
  align: 'left',
};

DropdownButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  title: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export function DropdownButtonItem({
  className, children, asLink, onClick, ...remainingProps
}) {
  return (
    <li
      className={className || undefined}
      {...remainingProps}
    >
      {asLink ? (
        <Link
          as={asLink}
          className={styles['dropdown-item']}
          onClick={onClick}
        >
          {children}
        </Link>
      ) : (
        <button
          type="button"
          className={styles['dropdown-item']}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </li>
  );
}

DropdownButtonItem.defaultProps = {
  className: '',
  onClick: undefined,
  asLink: undefined,
};

DropdownButtonItem.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  asLink: PropTypes.element,
  /**
     * html tag to render
     */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onClick: PropTypes.func,
};
