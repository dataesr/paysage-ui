import RelationsAssociated from '../../../components/blocs/relations-associated';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import LaureateForm from '../../../components/forms/laureate';
import { LAUREAT } from '../../../utils/relations-tags';

export default function StructurePrixEtRecompensesPage() {
  return (
    <>
      <RelationsByTag
        tag={LAUREAT}
        blocName="Lauréat de prix et récompenses"
        resourceType="prices"
        relatedObjectTypes={['structures']}
        inverse
        Form={LaureateForm}
      />
      <RelationsAssociated tag="prix" blocName="Associée au lauréat d'un prix" />
    </>
  );
}
