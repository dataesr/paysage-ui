import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { LAUREAT } from '../../../utils/relations-tags';

export default function PersonPrices() {
  return (
    <RelationsByTag
      tag={LAUREAT}
      blocName="Prix et récompenses"
      resourceType="prices"
      relatedObjectTypes={['projects']}
      inverse
    />
  );
}
