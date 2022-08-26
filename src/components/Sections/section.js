import PropTypes from 'prop-types';

export default function Section({ children, dataPaysageMenu, id, isEmpty }) {
  return (
    <div
      className="fr-container-fluid fr-mb-5w"
      as="section"
      data-paysage-menu={dataPaysageMenu}
      id={id}
    >
      {isEmpty ? <>...</> : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          { children }
        </>
      )}
    </div>
  );
}

Section.propTypes = {
  children: PropTypes.node,
  dataPaysageMenu: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool,
};

Section.defaultProps = {
  children: null,
  isEmpty: false,
};
