import { Col, Row, Text } from '@dataesr/react-dsfr';
import { useParams } from 'react-router-dom';

import { BlocContent, BlocTitle } from '../../bloc';
import Card from '../../card';
import Spinner from '../../spinner';
import useFetch from '../../../hooks/useFetch';

export default function ChiffresClesPresentation() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(`/structures/${id}`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  const all = [];
  if (data && data.academicYear && data.population) all.push({ key: `Nombre d'étudiants inscrits en ${data.academicYear}`, value: data.population });
  if (data && data.exercice && data.netAccountingResult) all.push({ key: `Résultat net comptable en ${data.exercice}`, value: `${data.netAccountingResult} €` });

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
