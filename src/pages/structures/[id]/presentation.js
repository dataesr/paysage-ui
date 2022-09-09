import { useParams } from 'react-router-dom';

import useFetch from '../../../hooks/useFetch';

import Categories from '../../../components/blocs/catgories';
import Emails from '../../../components/blocs/emails';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import Informations from '../../../components/blocs/informations';
import HistoriqueEtDates from '../../../components/blocs/historique-et-dates';
import PalmaresEtClassements from '../../../components/blocs/palmares-et-classements';
import PresenceSurLeWeb from '../../../components/blocs/presence-sur-le-web';
import ChiffresClesPresentation from '../../../components/blocs/chiffres-cles-presentation';
import GouvernancePresentation from '../../../components/blocs/gouvernance-presentation';
import DernieresActualites from '../../../components/blocs/dernieres-actualites';
import SuiviDGESIP from '../../../components/blocs/suivi-dgesip';

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
      <div id="informations">
        <Informations apiObject="structures" id={id} />
      </div>
      <div id="historique-et-dates">
        <HistoriqueEtDates apiObject="structures" id={id} />
        <Names apiObject="structures" id={id} />
      </div>
      <div id="categories">
        <Categories apiObject="structures" id={id} />
      </div>
      <div id="palmares-et-classements">
        <PalmaresEtClassements apiObject="structures" id={id} />
      </div>
      <div id="presence-sur-le-web">
        <PresenceSurLeWeb apiObject="structures" id={id} />
      </div>
      <div id="identifiants">
        <Identifiers apiObject="structures" id={id} />
      </div>
      <div id="chiffres-cles">
        <ChiffresClesPresentation apiObject="structures" id={id} />
      </div>
      <div id="gouvernance">
        <GouvernancePresentation apiObject="structures" id={id} />
        <Emails apiObject="structures" id={id} />
      </div>
      <div id="dernieres-actualites">
        <DernieresActualites apiObject="structures" id={id} />
      </div>
      <div id="suivi-dgesip">
        <SuiviDGESIP apiObject="structures" id={id} />
      </div>
    </>
  );
}
