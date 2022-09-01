import { useParams } from 'react-router-dom';
import { Col, Container, Row, Tag, Title } from '@dataesr/react-dsfr';

import useFetch from '../../hooks/useFetch';

// import Localisations from '../../components/Blocs/Localisations';
// import Emails from '../../components/Blocs/Emails';
// import Names from '../../components/Blocs/Names';
import Identifiers from '../../components/blocs/identifiers';
import Weblinks from '../../components/blocs/weblinks';
import SocialMedias from '../../components/blocs/social-medias';
import OfficialTexts from '../../components/blocs/official-texts';
import Documents from '../../components/blocs/documents';

export default function PersonByIdPage() {
  const { id } = useParams();

  const getData = useFetch(`/persons/${id}`);

  if (getData.isLoading) return <h1>Loading</h1>;
  return (
    <div className="persons-main-container">
      <Container fluid spacing="mt-5w">
        <Row>
          <Col n="3">
            <nav className="fr-sidemenu" aria-label="Menu latéral">
              <div className="fr-sidemenu__inner">
                <button
                  type="button"
                  className="fr-sidemenu__btn"
                  hidden
                  aria-controls="fr-sidemenu-wrapper"
                  aria-expanded="false"
                >
                  Dans cette rubrique
                </button>
                <div className="fr-collapse" id="fr-sidemenu-wrapper">
                  <div className="fr-sidemenu__title">Titre de rubrique</div>
                  <ul className="fr-sidemenu__list">
                    <li className="fr-sidemenu__item fr-sidemenu__item--active">
                      <a
                        className="fr-sidemenu__link"
                        href="#"
                        target="_self"
                        aria-current="page"
                      >
                        Accès direct
                      </a>
                    </li>
                    <li className="fr-sidemenu__item">
                      <a
                        className="fr-sidemenu__link"
                        href="#Les-identifiants"
                        target="_self"
                      >
                        Identifiants
                      </a>
                    </li>
                    <li className="fr-sidemenu__item">
                      <a className="fr-sidemenu__link" href="#2" target="_self">
                        Accès direct
                      </a>
                    </li>
                    <li className="fr-sidemenu__item">
                      <a className="fr-sidemenu__link" href="#3" target="_self">
                        Accès direct
                      </a>
                    </li>
                    <li className="fr-sidemenu__item">
                      <a className="fr-sidemenu__link" href="#4" target="_self">
                        Accès direct
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </Col>
          <Col>
            <Container as="main">
              <Title as="h2">
                {`${getData.data.lastName} ${getData.data.firstName}`}
              </Title>
              <Tag className="mx-1 bg-personnes ">Personne</Tag>
              {/* <Tag className="mx-1 bg-success">
                {getData.data.structureStatus}
              </Tag> */}

              {/* <Emails apiObject="persons" id={getData.data.id} /> */}
              {/* <Names apiObject="persons" id={getData.data.id} /> */}
              <Identifiers apiObject="persons" id={getData.data.id} />
              <Weblinks apiObject="persons" id={getData.data.id} />
              <SocialMedias apiObject="persons" id={getData.data.id} />
              <OfficialTexts apiObject="persons" id={getData.data.id} />
              <Documents apiObject="persons" id={getData.data.id} />

              {/* <div>
                <pre>{JSON.stringify(getData.data, null, 2)}</pre>
              </div> */}
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
