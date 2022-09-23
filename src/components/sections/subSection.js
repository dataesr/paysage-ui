import { Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function SubSection({ children, title }) {
  return (
    <section
      className="fr-container-fluid fr-mt-5w"
    >
      <Title as="h3">
        {title}
      </Title>
      <div className="fr-ml-5w">
        { children }
      </div>
    </section>
  );
}

SubSection.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

SubSection.defaultProps = {
  children: null,
  title: '',
};
