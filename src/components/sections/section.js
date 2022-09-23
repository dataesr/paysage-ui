import PropTypes from 'prop-types';

export default function Section({ children, dataPaysageMenu, id, isEmpty }) {
  return (
    <section
      className="fr-container-fluid fr-mb-5w"
      data-paysage-menu={dataPaysageMenu}
      id={id}
    >
      {isEmpty ? <>...</> : children}
    </section>
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
