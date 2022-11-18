import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { PRIX_CATEGORIE, PRIX_TERME } from '../../../utils/relations-tags';

export default function PriceCategories() {
  return (
    <>
      <RelationsByTag
        tag={PRIX_CATEGORIE}
        blocName="Catégories"
        resourceType="prices"
        relatedObjectTypes={['categories']}
        noRelationType
        sort="relatedObject.priority"
      />
      <RelationsByTag
        tag={PRIX_TERME}
        blocName="Termes"
        resourceType="prices"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
