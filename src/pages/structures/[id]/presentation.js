import { useParams } from 'react-router-dom';

import useFetch from '../../../hooks/useFetch';

import Localisations from '../../../components/blocs/localisations';
import Emails from '../../../components/blocs/emails';
import Names from '../../../components/blocs/names';
import Identifiers from '../../../components/blocs/identifiers';
import Weblinks from '../../../components/blocs/weblinks';
import SocialMedias from '../../../components/blocs/social-medias';
import OfficialTexts from '../../../components/blocs/official-texts';
import Documents from '../../../components/blocs/documents';
import Spinner from '../../../components/spinner';
import useHashScroll from '../../../hooks/useHashScroll';

export default function StructurePresentationPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useFetch('GET', `/structures/${id}`);
  useHashScroll();

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <div id="localisation">
        <Localisations apiObject="structures" id={id} data={data.currentLocalisation || null} />
      </div>

      <div id="informations">hello world</div>
      <Emails apiObject="structures" id={id} />
      <Names apiObject="structures" id={id} />
      <Identifiers apiObject="structures" id={id} />
      <Weblinks apiObject="structures" id={id} />
      <div id="testing">hello world</div>
      <SocialMedias apiObject="structures" id={id} />
      <Documents apiObject="structures" id={id} />
      <OfficialTexts apiObject="structures" id={id} />
    </>
  );
}
