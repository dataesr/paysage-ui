import { Row, Title, Icon } from '@dataesr/react-dsfr';

import ChiffresCles from '../../../components/blocs/chiffres-cles';
import DernieresActualites from '../../../components/blocs/dernieres-actualites';
import Emails from '../../../components/blocs/emails';
import HistoriqueEtDates from '../../../components/blocs/historique-et-dates';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import PalmaresEtClassements from '../../../components/blocs/palmares-et-classements';
import PresenceSurLeWeb from '../../../components/blocs/presence-sur-le-web';
import useHashScroll from '../../../hooks/useHashScroll';

export default function StructurePresentationPage() {
  useHashScroll();

  return (
    <>
      <Row>
        <Title as="h1" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <Localisations />
      <HistoriqueEtDates />
      <Names />
      <ChiffresCles />
      <PalmaresEtClassements />
      <PresenceSurLeWeb />
      <Identifiers />
      <Emails />
      <DernieresActualites />
    </>
  );
}
