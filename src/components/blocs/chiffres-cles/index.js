import PropTypes from 'prop-types';
import { Col, Container, Row } from '@dataesr/react-dsfr';
import { BlocContent, BlocTitle } from '../../bloc';
import cleanNumber from '../../../utils/clean-numbers';
import KeyValueCard from '../../card/key-value-card';

export default function ChiffresCles({ year, population, exercice, netAccountingResult }) {
  const all = [];
  if (year && population) {
    all.push({
      icon: 'ri-user-line',
      key: `Nombre d'étudiants inscrits en ${year} - Inscriptions principales`,
      linkIn: '../chiffres-cles/etudiants',
      value: population.toLocaleString('fr-FR'),
    });
  }
  if (exercice && netAccountingResult) {
    all.push({
      icon: 'ri-scales-3-line',
      key: `Résultat net comptable en ${exercice}`,
      linkIn: '../chiffres-cles/budget',
      value: `${cleanNumber(netAccountingResult)}€`,
    });
  }

  if (all.length === 0) return null;
  return (
    <Container fluid className="fr-mb-5w">
      <BlocTitle as="h3" look="h6">Chiffres clés</BlocTitle>
      <BlocContent>
        <Row gutters>
          {all.map((element) => (
            <Col key={element.key} n="12 md-6">
              <KeyValueCard
                cardKey={element.key}
                cardValue={element.value}
                icon={element.icon}
                key={element.id}
                linkIn={element.linkIn}
              />
            </Col>
          ))}
        </Row>
      </BlocContent>
    </Container>
  );
}

ChiffresCles.defaultProps = {
  year: null,
  population: null,
  exercice: null,
  netAccountingResult: null,
};

ChiffresCles.propTypes = {
  year: PropTypes.string,
  population: PropTypes.number,
  exercice: PropTypes.string,
  netAccountingResult: PropTypes.number,
};
