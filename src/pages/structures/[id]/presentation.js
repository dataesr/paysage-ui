import { useParams } from 'react-router-dom';
import { Row, Title, Icon } from '@dataesr/react-dsfr';
import Categories from '../../../components/blocs/catgories';
import ChiffresClesPresentation from '../../../components/blocs/chiffres-cles-presentation';
import DernieresActualites from '../../../components/blocs/dernieres-actualites';
import Emails from '../../../components/blocs/emails';
// import GouvernancePresentation from '../../../components/blocs/gouvernance';
import HistoriqueEtDates from '../../../components/blocs/historique-et-dates';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import PalmaresEtClassements from '../../../components/blocs/palmares-et-classements';
import PresenceSurLeWeb from '../../../components/blocs/presence-sur-le-web';
import SuiviDGESIP from '../../../components/blocs/suivi-dgesip';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';

export default function StructurePresentationPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useFetch(`/structures/${id}`);
  useHashScroll();

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Row>
        <Title as="h1" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <div id="localisation">
        <Localisations
          apiObject="structures"
          id={id}
          currentLocalisationId={data.currentLocalisation.id || null}
        />
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
      {/* <GouvernancePresentation apiObject="structures" id={id} /> */}
      <div id="email">
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
