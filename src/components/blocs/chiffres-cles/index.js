import { Col, Container, Row } from '@dataesr/react-dsfr';

import { BlocContent, BlocTitle } from '../../bloc';
import Spinner from '../../spinner';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import cleanNumber from '../../../utils/clean-numbers';
import KeyValueCard from '../../card/key-value-card';

export default function ChiffresCles() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  const all = [];
  if (data && data.year && data.population) {
    all.push({
      icon: 'ri-user-line',
      key: `Nombre d'étudiants inscrits en ${data.year} - Inscriptions principales`,
      linkIn: '../chiffres-cles/etudiants',
      value: data.population.toLocaleString('fr-FR'),
    });
  }
  if (data && data.exercice && data.netAccountingResult) {
    all.push({
      icon: 'ri-scales-3-line',
      key: `Résultat net comptable en ${data.exercice}`,
      linkIn: '../chiffres-cles/budget',
      value: `${cleanNumber(data.netAccountingResult)}€`,
    });
  }

  const renderCards = () => all.map((el) => (
    <Col n="12 md-6">
      <KeyValueCard
        cardKey={el.key}
        cardValue={el.value}
        icon={el.icon}
        key={el.id}
        linkIn={el.linkIn}
      />
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
