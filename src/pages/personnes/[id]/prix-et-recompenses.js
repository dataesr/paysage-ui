import Relations from '../../../components/blocs/relations-by-tag';
import LaureateForm from '../../../components/forms/laureate';
import { LAUREAT } from '../../../utils/relations-tags';

export default function PersonPrices() {
  return (
    <Relations
      tag={LAUREAT}
      blocName="Prix et récompenses"
      resourceType="prices"
      relatedObjectTypes={['persons']}
      Form={LaureateForm}
      inverse
    />
  );
}
