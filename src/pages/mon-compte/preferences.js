import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Radio, RadioGroup, Row, Title } from '@dataesr/react-dsfr';
import { ReactComponent as Light } from '../../assets/light.svg';
import { ReactComponent as Dark } from '../../assets/dark.svg';
import { ReactComponent as System } from '../../assets/system.svg';
import { ReactComponent as Edit } from '../../assets/edit-line.svg';
import { ReactComponent as View } from '../../assets/eye-line.svg';

import useAuth from '../../hooks/useAuth';

export default function PreferencesPage() {
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const defaultPreference = system.matches ? 'dark' : 'light';
  const themes = [
    { label: 'Thème clair', value: 'light', svg: <Light /> },
    { label: 'Thème sombre', value: 'dark', svg: <Dark /> },
    { label: 'Thème du système', value: defaultPreference, svg: <System /> },
  ];
  const views = [
    { label: 'Mode normal', hint: 'Afficher les pages en mode vue par défaut.', value: false, svg: <View /> },
    { label: 'Mode édition', hint: 'Afficher les pages en mode édition par défaut.', value: true, svg: <Edit /> },
  ];
  const { viewer } = useAuth();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/mon-compte/" />}>{`${viewer?.firstName} ${viewer?.lastName}`}</BreadcrumbItem>
        <BreadcrumbItem>Préférences</BreadcrumbItem>
      </Breadcrumb>
      <Container fluid>
        <Row className="fr-pb-5w">
          <Col><Title as="h2">Préférences</Title></Col>
        </Row>
        <Row>
          <Col><Title as="h3" look="h5">Paramètres d'affichage</Title></Col>
        </Row>
        <Row className="fr-pb-5w">
          <RadioGroup
            isInline
            legend="Choisissez un thème pour personnaliser l’apparence du site."
            value={window.localStorage.getItem('prefers-color-scheme')}
            onChange={(value) => {
              window.localStorage.setItem('prefers-color-scheme', value);
              document.documentElement.setAttribute('data-fr-theme', value);
            }}
          >
            {themes.map((theme) => (
              <Radio
                key={theme.value}
                label={theme.label}
                value={theme.value}
                isExtended
                svg={theme.svg}
              />
            ))}
          </RadioGroup>
        </Row>
        {(viewer.role !== 'reader') && (
          <>
            <Row className="fr-pb-5w">
              <Col><Title as="h3" look="h5">Mode édition</Title></Col>
            </Row>
            <Row className="fr-pb-5w">
              <RadioGroup
                isInline
                legend="Choisissez un mode d'affichage des pages par défaut"
                value={JSON.parse(localStorage.getItem('prefers-edit-mode'))}
                onChange={(value) => {
                  localStorage.setItem('prefers-edit-mode', value);
                }}
              >
                {views.map((view) => (
                  <Radio
                    key={view.value}
                    label={view.label}
                    value={view.value}
                    isExtended
                    svg={view.svg}
                  />
                ))}
              </RadioGroup>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}
