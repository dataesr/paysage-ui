import React, {
  cloneElement, Children, useRef, useEffect, useState,
} from 'react';

import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useFocusTrap from './useFocusTrap';
import ModalClose from './ModalClose';
import dataAttributes from './data-attributes';

// import styles from './styles.module.scss';
// import '@gouvfr/dsfr/dist/component/modal/modal.css';

/**
 *
 * @visibleName Modale -- Modal
 */

const MODAL_ANIMATION_TIME = 300;

const ModalDialog = ({
  children,
  hide,
  size,
  className,
  isOpen,
  canClose,
  ...remainingProps
}) => {
  const modalRef = useRef();
  const [openedModal, setOpenedModal] = useState(() => isOpen);
  const colSizes = { sm: 4, md: 6, lg: 8, xl: 10, full: 12 };
  const colSize = colSizes[size];
  const _className = classNames('fr-modal', {
    'fr-modal--opened': openedModal,
  }, className);
  const focusBackTo = document.activeElement;
  const handleTabulation = useFocusTrap(modalRef);
  const title = Children.toArray(children).filter((child) => child.props.__TYPE === 'ModalTitle');
  const content = Children.toArray(children).filter((child) => child.props.__TYPE === 'ModalContent');
  const footer = Children.toArray(children).filter((child) => child.props.__TYPE === 'ModalFooter');
  const close = Children.toArray(children).filter((child) => child.props.__TYPE === 'ModalClose');

  useEffect(() => () => {
    document.body.style.overflow = null;
  }, []);

  const handleModal = (open) => {
    if (modalRef.current) {
      setOpenedModal(open);
      document.body.style.overflow = open ? 'hidden' : null;
    }
  };

  const handleAnimatedUnmount = () => {
    handleModal(false);
    setTimeout(() => {
      if (focusBackTo) focusBackTo.focus();
      hide();
    }, MODAL_ANIMATION_TIME);
  };

  const handleOverlayClick = (e) => {
    if (!canClose) {
      return;
    }

    if (!modalRef.current || (modalRef.current === e.target) || e.target.className.indexOf('closing-overlay') > -1) {
      handleAnimatedUnmount();
    }
  };

  useEffect(() => {
    handleModal(true);
  }, []);

  const handleAllKeyDown = (e) => {
    if (e.keyCode === 27) {
      hide();
      e.preventDefault();
    }
    if (e.keyCode === 9) {
      handleTabulation(e);
    }
  };

  let closeComponent;
  if (close.length > 0) {
    closeComponent = cloneElement(close[0], { hide: handleAnimatedUnmount });
  } else {
    closeComponent = canClose ? <ModalClose hide={handleAnimatedUnmount} /> : null;
  }
  const component = (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      aria-labelledby="fr-modal-title-modal"
      className={`${_className} {styles.Modal}`}
      ref={modalRef}
      onKeyDown={(e) => handleAllKeyDown(e)}
      onClick={(e) => handleOverlayClick(e)}
      {...dataAttributes.getAll(remainingProps)}
    >
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center closing-overlay">
          <div className={`fr-col-12 fr-col-md-${colSize}`}>
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                {closeComponent}
              </div>
              <div className="fr-modal__content">
                {title}
                {content}
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
  return (
    ReactDOM.createPortal(
      component,
      document.body,
    )
  );
};

function Modal({
  id, size, hide, children, isOpen, className, canClose, ...remainingProps
}) {
  return (isOpen) && (
    <ModalDialog
      id={id}
      className={className}
      size={size}
      hide={hide}
      canClose={canClose}
      {...dataAttributes.getAll(remainingProps)}
    >
      {children}
    </ModalDialog>
  );
}

Modal.propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hide: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  canClose: PropTypes.bool,
};
Modal.defaultProps = {
  id: undefined,
  isOpen: false,
  size: 'full',
  className: '',
  canClose: true,
};

export default Modal;
