import { RelationsByTag } from '../../../components/blocs/relations';
import RelationGeo from '../../../components/blocs/relations/components/relations-geo';
import { STRUCTURE_CATEGORIE, STRUCTURE_CATEGORIE_JURIDIQUE, STRUCTURE_TERME } from '../../../utils/relations-tags';

export default function StructureCategoriesPage() {
  return (
    <>
      <RelationsByTag
        tag={STRUCTURE_CATEGORIE_JURIDIQUE}
        blocName="Catégories juridiques"
        resourceType="structures"
        relatedObjectTypes={['legal-categories']}
        noRelationType
      />
      <RelationsByTag
        tag={STRUCTURE_CATEGORIE}
        blocName="Catégories"
        resourceType="structures"
        relatedObjectTypes={['categories']}
        noRelationType
        sort="relatedObject.priority"
      />
      <RelationGeo
        blocName="Catégories géographique"
      />
      <RelationsByTag
        tag={STRUCTURE_TERME}
        blocName="Termes"
        resourceType="structures"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
