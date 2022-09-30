import { Title } from '@dataesr/react-dsfr';
import InternalPagesComponent from '../internal-pages';
import SocialMedias from '../social-medias';
import Weblinks from '../weblinks';
import Wikipedia from '../wikipedia';

export default function PresenceSurLeWeb() {
  return (
    <>
      <Title>Présence sur le web</Title>
      <Weblinks />
      <InternalPagesComponent />
      <SocialMedias />
      <Wikipedia />
    </>
  );
}
