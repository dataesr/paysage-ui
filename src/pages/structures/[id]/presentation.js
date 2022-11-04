import { Row, Title, Col } from '@dataesr/react-dsfr';
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
import StructureCurrentGovernance from '../../../components/blocs/current-governance';
import KeyValueCard from '../../../components/card/key-value-card';
import useFetch from '../../../hooks/useFetch';
import Spinner from '../../../components/spinner';
import useUrl from '../../../hooks/useUrl';
import CurrentLegals from '../../../components/blocs/current-legal';
import CurrentLogos from '../../../components/blocs/current-logo';
import CurrentSupervisors from '../../../components/blocs/current-supervisors';

export default function StructurePresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  const { editMode } = useEditMode();
  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
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
      {(!editMode) && (
        <>
          <Row gutters spacing="mb-5w">
            <Col n={(data?.descriptionFr || data?.descriptionEn) ? '12' : '12 lg-4'}>
              <KeyValueCard
                titleAsText
                className="card-structures"
                cardKey="Description"
                cardValue={data?.descriptionFr || data?.descriptionEn}
                icon="ri-align-left"
              />
            </Col>
            <Col n="12 lg-4">
              <CurrentLegals />
            </Col>
            <Col n="12 lg-4">
              <CurrentSupervisors />
            </Col>
            <Col n="12 lg-4">
              <CurrentLogos />
            </Col>
          </Row>
          <ChiffresCles />
          <StructureCurrentGovernance />
        </>
      )}
      {editMode && <Names />}
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Row gutters>
        <Col n="12 md-6">
          <Weblinks types={INTERNAL_PAGES_TYPES} title="Site internet" />
        </Col>
        <Col n="12 md-6">
          <SocialMedias />
        </Col>
        {!editMode && <Col n="12"><Wiki /></Col>}
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
