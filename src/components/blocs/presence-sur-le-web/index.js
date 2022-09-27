import PropTypes from 'prop-types';
import { Title } from '@dataesr/react-dsfr';
import InternalPagesComponent from '../internal-pages';
import SocialMedias from '../social-medias';
import Weblinks from '../weblinks';
import Wikipedia from '../wikipedia';

export default function PresenceSurLeWeb({ apiObject }) {
  return (
    <>
      <Title>Présence sur le web</Title>
      <Weblinks apiObject={apiObject} />
      <InternalPagesComponent apiObject={apiObject} />
      <SocialMedias apiObject={apiObject} />
      <Wikipedia apiObject={apiObject} />
    </>
  );
}

PresenceSurLeWeb.propTypes = {
  apiObject: PropTypes.string.isRequired,
};
