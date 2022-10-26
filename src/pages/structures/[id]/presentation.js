import { Row, Title, Col, Container } from '@dataesr/react-dsfr';
import ChiffresCles from '../../../components/blocs/chiffres-cles';
import Emails from '../../../components/blocs/emails';
import HistoriqueEtDates from '../../../components/blocs/historique-et-dates';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import Weblinks from '../../../components/blocs/weblinks';
import { INTERNAL_PAGES_TYPES, WEBLINKS_TYPES, PALMARES_TYPES } from '../../../components/blocs/weblinks/constants';
import SocialMedias from '../../../components/blocs/social-medias';
import useHashScroll from '../../../hooks/useHashScroll';
import useEditMode from '../../../hooks/useEditMode';
import Wiki from '../../../components/blocs/wiki';

export default function StructurePresentationPage() {
  useHashScroll();
  const { editMode } = useEditMode();
  return (
    <>
      <Row>
        <Col n="12">
          <Title as="h3" look="h4">En un coup d'oeil</Title>
        </Col>
      </Row>
      <Row gutters className="flex--wrap-reverse">
        <Col n="12 xl-6">
          <HistoriqueEtDates />
        </Col>
        <Col n="12 xl-6">
          <Localisations />
        </Col>
      </Row>
      <ChiffresCles />
      {editMode && <Names />}
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Container fluid spacing="mb-5w">
        <Row gutters>
          <Wiki />
        </Row>
      </Container>
      <Row gutters>
        <Col n="12 md-6">
          <Weblinks types={INTERNAL_PAGES_TYPES} title="Site internet" />
        </Col>
        <Col n="12 md-6">
          <SocialMedias />
        </Col>
        <Col n="12 md-6">
          <Weblinks types={WEBLINKS_TYPES} title="Ailleurs sur le web" />
        </Col>
        <Col n="12 md-6">
          <Weblinks types={PALMARES_TYPES} title="Palmarès et classements" />
        </Col>
      </Row>
      <Emails />
      <Identifiers />
    </>
  );
}
