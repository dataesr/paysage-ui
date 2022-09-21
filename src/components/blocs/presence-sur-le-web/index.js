import PropTypes from 'prop-types';

import InternalPagesComponent from '../internal-pages';
import SubSection from '../../sections/subSection';
import SocialMedias from '../social-medias';
import Weblinks from '../weblinks';
import Wikipedia from '../wikipedia';

export default function PresenceSurLeWeb({ apiObject, id }) {
  return (
    <SubSection title="Présence sur le web">
      <Weblinks apiObject={apiObject} id={id} />
      <InternalPagesComponent apiObject={apiObject} id={id} />
      <SocialMedias apiObject={apiObject} id={id} />
      <Wikipedia apiObject={apiObject} id={id} />
    </SubSection>
  );
}

PresenceSurLeWeb.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
