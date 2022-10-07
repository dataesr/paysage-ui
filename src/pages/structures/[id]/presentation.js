import { Row, Title, Icon } from '@dataesr/react-dsfr';

import ChiffresCles from '../../../components/blocs/chiffres-cles';
import Emails from '../../../components/blocs/emails';
import HistoriqueEtDates from '../../../components/blocs/historique-et-dates';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import Weblinks from '../../../components/blocs/weblinks';
import SocialMedias from '../../../components/blocs/social-medias';
import Wikipedia from '../../../components/blocs/wikipedia';
import useHashScroll from '../../../hooks/useHashScroll';
import { INTERNAL_PAGES_TYPES, WEBLINKS_TYPES, PALMARES_TYPES } from '../../../components/blocs/weblinks/constants';

export default function StructurePresentationPage() {
  useHashScroll();
  return (
    <>
      <Row>
        <Title as="h2" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <Localisations />
      <HistoriqueEtDates />
      <Names />
      <ChiffresCles />
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Weblinks types={WEBLINKS_TYPES} />
      <Weblinks types={INTERNAL_PAGES_TYPES} title="Pages internes" />
      <SocialMedias />
      <Weblinks types={PALMARES_TYPES} title="Palmarès et classements" />
      <Wikipedia />
      <Identifiers />
      <Emails />
    </>
  );
}
