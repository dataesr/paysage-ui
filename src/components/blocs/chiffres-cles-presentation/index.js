import { Row, Text } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import { BlocContent, BlocTitle } from '../../bloc';
import ExpendableListCards from '../../card/expendable-list-cards';
import ModifyCard from '../../card/modify-card';

export default function ChiffresClesPresentation({ apiObject, data }) {
  const renderCards = () => {
    if (!data) return null;
    const all = [
      { key: `Nombre d'étudiants inscrits en ${data.academicYear}`, value: data.population },
      { key: `Résultat net comptable en ${data.exercice}`, value: data.netAccountingResult },
    ];
    const list = all.map((el) => (
      <ModifyCard
        title={el.key}
        description={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{el.value}</Text>
          </Row>
        )}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} />;
  };

  return (
    <div>
      <BlocTitle as="h3" look="h6">Chiffres clés</BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </div>
  );
}

ChiffresClesPresentation.propTypes = {
  apiObject: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
