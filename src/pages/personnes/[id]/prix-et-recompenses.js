import Relations from '../../../components/blocs/relations-by-tag';
import LaureateForm from '../../../components/forms/laureate';
import { LAUREAT } from '../../../utils/relations-tags';

export default function PersonPrizes() {
  return (
    <Relations
      tag={LAUREAT}
      blocName="Prix et récompenses"
      resourceType="prizes"
      relatedObjectTypes={['persons']}
      Form={LaureateForm}
      inverse
    />
  );
}
