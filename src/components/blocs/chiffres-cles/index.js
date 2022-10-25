import { Col, Container, Icon, Row } from '@dataesr/react-dsfr';

import { BlocContent, BlocTitle } from '../../bloc';
import Spinner from '../../spinner';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import cleanNumber from '../../../utils/cleanNumbers';

export default function ChiffresCles() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  const all = [];
  if (data && data.year && data.population) {
    all.push({ key: `Nombre d'étudiants inscrits en ${data.year}`, value: data.population.toLocaleString('fr-FR'), icon: 'ri-user-line', link: '/' });
  }
  if (data && data.exercice && data.netAccountingResult) {
    all.push({ key: `Résultat net comptable en ${data.exercice}`, value: `${cleanNumber(data.netAccountingResult)}€`, icon: 'ri-user-line', link: '/' });
  }

  const renderCards = () => all.map((el) => (
    <Col n="12 md-6">
      <div key={el.id} className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <p className="fr-card__title">
              <span className="fr-pr-1w">{el.value}</span>
            </p>
            <div className="fr-card__start">
              <p className="fr-card__detail fr-text--sm fr-mb-0">
                <Icon name={el.icon} size="1x" />
                {el.key}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Col>
  ));

  if (all.length === 0) return null;
  return (
    <Container fluid className="fr-mb-5w">
      <BlocTitle as="h3" look="h6">Chiffres clés</BlocTitle>
      <BlocContent>
        <Row gutters>
          {renderCards()}
        </Row>
      </BlocContent>
    </Container>
  );
}
