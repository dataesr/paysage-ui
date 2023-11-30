import { Col, Row } from '@dataesr/react-dsfr';
import KeyValueCard from './key-value-card';
import { capitalize } from '../../utils/strings';

export default function GroupsCard(groups) {
  const { groups: groupArray } = groups;

  function getCardValue(group) {
    const capitalizedGroup = capitalize(group);

    if (group === 'bologne') {
      return 'Membre du processus de Bologne';
    } if (group.startsWith('ue')) {
      return "Membre de l'Union européenne";
    }
    if (group === 'g7') {
      return 'Membre du G7';
    }
    if (group === 'g20') {
      return 'Membre du G20';
    }
    return capitalizedGroup;
  }
  return (
    <Row gutters>
      {groupArray.map((group, index) => (
        <Col n="12 md-4" key={index}>
          <KeyValueCard
            cardValue={getCardValue(group)}
            className="card-geographical-categories"
            cardKey=""
          />
        </Col>
      ))}
    </Row>
  );
}
