import RelationsByTag from '../../../components/blocs/relations-by-tag';
import { PRIX_CATEGORIE, PRIX_TERME } from '../../../utils/relations-tags';

export default function PrizeCategories() {
  return (
    <>
      <RelationsByTag
        tag={PRIX_CATEGORIE}
        blocName="Catégories"
        resourceType="prizes"
        relatedObjectTypes={['categories']}
        noRelationType
        sort="relatedObject.priority"
      />
      <RelationsByTag
        tag={PRIX_TERME}
        blocName="Termes"
        resourceType="prizes"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
