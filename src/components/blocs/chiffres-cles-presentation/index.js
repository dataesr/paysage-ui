import { Col, Row, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import { BlocContent, BlocTitle } from '../../bloc';
import Card from '../../card';

export default function ChiffresClesPresentation({ data }) {
  const renderCards = () => {
    if (!data) return null;
    const all = [
      { key: `Nombre d'étudiants inscrits en ${data.academicYear}`, value: data.population },
      { key: `Résultat net comptable en ${data.exercice}`, value: `${data.netAccountingResult} €` },
    ];
    return all.map((el) => (
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
  };

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

ChiffresClesPresentation.propTypes = {
  data: PropTypes.object.isRequired,
};
