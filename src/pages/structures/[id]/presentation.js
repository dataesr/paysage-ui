import { useParams } from 'react-router-dom';

import useFetch from '../../../hooks/useFetch';

import Categories from '../../../components/blocs/catgories';
import Documents from '../../../components/blocs/documents';
import Emails from '../../../components/blocs/emails';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import OfficialTexts from '../../../components/blocs/official-texts';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';

import useHashScroll from '../../../hooks/useHashScroll';

export default function StructurePresentationPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useFetch(`/structures/${id}`);
  useHashScroll();

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <div id="localisation">
        <Localisations
          apiObject="structures"
          id={id}
          data={data.currentLocalisation || null}
        />
      </div>

      <div id="informations">hello world</div>
      <Emails apiObject="structures" id={id} />
      <Names apiObject="structures" id={id} />
      <Categories apiObject="structures" id={id} />
      <Identifiers apiObject="structures" id={id} />
      <Weblinks apiObject="structures" id={id} />
      <div id="testing">hello world</div>
      <SocialMedias apiObject="structures" id={id} />
      <Documents apiObject="structures" id={id} />
      <OfficialTexts apiObject="structures" id={id} />
    </>
  );
}
