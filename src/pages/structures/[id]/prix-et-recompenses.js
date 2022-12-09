import RelationsAssociated from '../../../components/blocs/relations-associated';
import RelationsByTag from '../../../components/blocs/relations-by-tag';
import LaureateForm from '../../../components/forms/laureate';
import PriceAttributionForm from '../../../components/forms/price-attribution';
import { LAUREAT, PRIX_PORTEUR } from '../../../utils/relations-tags';

export default function StructurePrixEtRecompensesPage() {
  return (
    <>
      <RelationsByTag
        tag={LAUREAT}
        blocName="Prix et récompenses obtenus par la structure"
        resourceType="prices"
        relatedObjectTypes={['structures']}
        inverse
        Form={LaureateForm}
      />
      <RelationsAssociated
        tag={LAUREAT}
        blocName="Prix obtenus par des membres de la structure"
      />
      <RelationsByTag
        tag={PRIX_PORTEUR}
        blocName="Prix attribués par la structure"
        resourceType="prices"
        relatedObjectTypes={['structures']}
        inverse
        Form={PriceAttributionForm}
      />
    </>
  );
}
