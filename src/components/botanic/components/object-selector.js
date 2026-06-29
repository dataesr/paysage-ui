import PropTypes from 'prop-types';
import { Col, Row, TileBody, Tile } from '@dataesr/react-dsfr';

const OBJECTS = [
  {
    id: 'person',
    icon: 'ri-user-3-line',
    title: 'Personne',
    description: 'Ajouter ou mettre à jour une personne ou ses identifiants et mandats.',
  },
  {
    id: 'structure',
    icon: 'ri-building-2-line',
    title: 'Structure',
    description: 'Ajouter ou mettre à jour une structure ou ses identifiants et mandats de gouvernance.',
  },
  // {
  //   id: 'prize',
  //   icon: 'ri-award-line',
  //   title: 'Prix',
  //   description: 'Ajouter ou mettre à jour un prix ou ses lauréats.',
  // },
];

export default function ObjectSelector({ onSelect }) {
  return (
    <div>
      <p className="fr-text--lead fr-mb-4w">Que souhaitez-vous créer ou mettre à jour ?</p>
      <Row gutters className="fr-grid-row--equal-height">
        {OBJECTS.map((obj) => (
          <Col className="card-button" key={obj.id}>
            <Tile onClick={() => onSelect(obj.id)}>
              <TileBody
                title={obj.title}
                titleAs="h2"
                description={obj.description}
                asLink={<span />}
              />
              <div className="fr-tile__img">
                <i className={`${obj.icon} ri-3x`} aria-hidden="true" />
              </div>
            </Tile>
          </Col>
        ))}
      </Row>
    </div>
  );
}

ObjectSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
