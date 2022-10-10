import { Col, Row, Text } from '@dataesr/react-dsfr';

import { BlocContent, BlocTitle } from '../../bloc';
import Card from '../../card';
import Spinner from '../../spinner';
import useFetch from '../../../hooks/useFetch';
import cleanNumber from '../../../hooks/useNumbers';
import useUrl from '../../../hooks/useUrl';

export default function ChiffresCles() {
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  const all = [];
  if (data && data.year && data.population) all.push({ key: `Nombre d'étudiants inscrits en ${data.year}`, value: data.population.toLocaleString('fr-FR') });
  if (data && data.exercice && data.netAccountingResult) all.push({ key: `Résultat net comptable en ${data.exercice}`, value: `${cleanNumber(data.netAccountingResult)}€` });

  const renderCards = () => all.map((el) => (
    <Col n="12 md-6">
      <Card
        title={el.key}
        descriptionElement={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{el.value}</Text>
          </Row>
        )}
      />
    </Col>
  ));

  if (all.length === 0) return null;
  return (
    <div>
      <BlocTitle as="h3" look="h6">Chiffres clés</BlocTitle>
      <BlocContent>
        <Row gutters>
          {renderCards()}
        </Row>
      </BlocContent>
    </div>
  );
}
