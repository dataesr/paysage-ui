import { useParams } from 'react-router-dom';

import useFetch from '../../../hooks/useFetch';

import Localisations from '../../../components/Blocs/Localisations';
import Emails from '../../../components/Blocs/Emails';
import Names from '../../../components/Blocs/Names';
import Identifiers from '../../../components/Blocs/Identifiers';
import Weblinks from '../../../components/Blocs/Weblinks';
import SocialMedias from '../../../components/Blocs/SocialMedias';
import OfficialTexts from '../../../components/Blocs/OfficialTexts';
import Documents from '../../../components/Blocs/Documents';
import Spinner from '../../../components/Spinner';
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
