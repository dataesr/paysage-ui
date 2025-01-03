import { useOutletContext } from 'react-router-dom';
import { Col, Row, Title } from '@dataesr/react-dsfr';

import ChiffresCles from '../../../components/blocs/chiffres-cles';
import StructureCurrentGovernance from '../../../components/blocs/current-governance';
import Emails from '../../../components/blocs/emails';
import HistoriqueEtDates from '../../../components/blocs/historique-et-dates';
import Identifiers from '../../../components/blocs/identifiers';
import Localisations from '../../../components/blocs/localisations';
import Names from '../../../components/blocs/names';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import { INTERNAL_PAGES_TYPES, PALMARES_TYPES, WEBLINKS_TYPES } from '../../../components/blocs/weblinks/constants';
import Wiki from '../../../components/blocs/wiki';
import KeyValueCard from '../../../components/card/key-value-card';
import useEditMode from '../../../hooks/useEditMode';
import CurrentLegals from '../../../components/blocs/current-legal';
import CurrentLogos from '../../../components/blocs/current-logo';
import CurrentSupervisors from '../../../components/blocs/current-supervisors';

export default function StructurePresentationPage() {
  const data = useOutletContext();
  const { editMode } = useEditMode();
  if (!data) return null;
  const { descriptionEn, descriptionFr, exercice, motto, netAccountingResult, population, source, year } = data;
  return (
    <>
      <Row>
        <Col n="12">
          <Title as="h2" look="h5">En un coup d'oeil</Title>
        </Col>
      </Row>
      <Names visible={editMode} />
      <Row gutters spacing="mb-5w">
        <CurrentLegals />
        <CurrentSupervisors />
        <CurrentLogos />
        {motto && (
          <Col n="12 lg-4">
            <KeyValueCard
              titleAsText
              className="card-structures"
              cardKey="Devise"
              cardValue={motto}
              icon="ri-mic-2-line"
            />
          </Col>
        )}
      </Row>
      <Row gutters spacing="mb-5w">
        <Col>
          <HistoriqueEtDates />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <Localisations />
        </Col>
      </Row>
      <Row gutters spacing="mb-5w">
        <Col n="12">
          <KeyValueCard
            titleAsText
            className="card-structures"
            cardKey="Description"
            cardValue={descriptionFr || descriptionEn}
            icon="ri-align-left"
          />
        </Col>
        <Col n="12"><Wiki /></Col>
      </Row>
      <ChiffresCles
        exercice={exercice}
        netAccountingResult={netAccountingResult}
        population={population}
        source={source}
        year={year}
      />
      <StructureCurrentGovernance />
      <Title as="h2" look="h4">Présence sur le web</Title>
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
