import { RelationsAssociated, RelationsByTag } from '../../../components/blocs/relations';
import LaureateForm from '../../../components/forms/laureate';
import PrizeAttributionForm from '../../../components/forms/prize-attribution';
import { LAUREAT, PRIX_PORTEUR } from '../../../utils/relations-tags';

export default function StructurePrixEtRecompensesPage() {
  return (
    <>
      <RelationsByTag
        tag={LAUREAT}
        blocName="Prix et récompenses obtenus par la structure"
        resourceType="prizes"
        relatedObjectTypes={['structures']}
        inverse
        noFilters
        Form={LaureateForm}
      />
      <RelationsAssociated
        tag={LAUREAT}
        blocName="Prix obtenus par des membres de la structure"
      />
      <RelationsByTag
        tag={PRIX_PORTEUR}
        blocName="Prix attribués par la structure"
        resourceType="prizes"
        relatedObjectTypes={['structures']}
        inverse
        noFilters
        Form={PrizeAttributionForm}
      />
    </>
  );
}
