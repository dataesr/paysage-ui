import PropTypes from 'prop-types';
import { Col, Container, Row } from '@dataesr/react-dsfr';
import { BlocContent, BlocTitle } from '../../bloc';
import cleanNumber from '../../../utils/clean-numbers';
import KeyValueCard from '../../card/key-value-card';

export default function ChiffresCles({ exercice, netAccountingResult, population, source, year }) {
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
      key: `Résultat net comptable en ${exercice} (${source})`,
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
  exercice: null,
  netAccountingResult: null,
  population: null,
  source: null,
  year: null,
};

ChiffresCles.propTypes = {
  exercice: PropTypes.string,
  netAccountingResult: PropTypes.number,
  population: PropTypes.number,
  source: PropTypes.string,
  year: PropTypes.string,
};
