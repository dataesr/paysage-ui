import { Highlight } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function EmptySection({ apiObject }) {
  let className = '';
  switch (apiObject) {
  case 'structures':
    className = 'fr-highlight--yellow-tournesol';
    break;
  case 'persons':
    className = 'fr-highlight--pink-tuile';
    break;
  case 'categories':
    className = 'fr-highlight--green-bourgeon';
    break;
  case 'prices':
    className = 'fr-highlight--blue-ecume';
    break;
  case 'documents':
    className = 'fr-highlight--green-archipel';
    break;
  case 'terms':
    className = 'fr-highlight--purple-glycine';
    break;
  case 'textes-officiels':
    className = 'fr-highlight--green-emeraude';
    break;
  default:
    className = 'fr-highlight--beige-gris-galet';
  }

  return (
    <Highlight className={className}>
      Cette section est vide pour le moment
    </Highlight>
  );
}

EmptySection.propTypes = {
  apiObject: PropTypes.string,
};

EmptySection.defaultProps = {
  apiObject: '',
};
