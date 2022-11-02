import { Col, Container, Row } from '@dataesr/react-dsfr';

import { BlocContent, BlocTitle } from '../../bloc';
import Spinner from '../../spinner';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import cleanNumber from '../../../utils/cleanNumbers';
import KeyValueCard from '../../card/key-value-card';

export default function ChiffresCles() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  const all = [];
  if (data && data.year && data.population) {
    all.push({ key: `Nombre d'étudiants inscrits en ${data.year} - Inscriptions principales`, value: data.population.toLocaleString('fr-FR'), icon: 'ri-user-line', link: '/' });
  }
  if (data && data.exercice && data.netAccountingResult) {
    all.push({ key: `Résultat net comptable en ${data.exercice}`, value: `${cleanNumber(data.netAccountingResult)}€`, icon: 'ri-scales-3-line', link: '/' });
  }

  const renderCards = () => all.map((el) => (
    <Col n="12 md-6">
      <KeyValueCard
        key={el.id}
        cardKey={el.key}
        cardValue={el.value}
        icon={el.icon}
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
