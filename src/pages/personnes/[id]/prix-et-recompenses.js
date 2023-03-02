import { RelationsByTag } from '../../../components/blocs/relations';
import LaureateForm from '../../../components/forms/laureate';
import { LAUREAT } from '../../../utils/relations-tags';

export default function PersonPrizes() {
  return (
    <RelationsByTag
      tag={LAUREAT}
      blocName="Prix et récompenses"
      resourceType="prizes"
      relatedObjectTypes={['persons']}
      Form={LaureateForm}
      inverse
      noFilters
    />
  );
}
