import { RelationsByTag } from '../../../components/blocs/relations';
import { PERSONNE_CATEGORIE, PERSONNE_TERME } from '../../../utils/relations-tags';

export default function PersonCategories() {
  return (
    <>
      <RelationsByTag
        tag={PERSONNE_CATEGORIE}
        blocName="Catégories"
        resourceType="persons"
        relatedObjectTypes={['categories']}
        noRelationType
        sort="relatedObject.priority"
      />
      <RelationsByTag
        tag={PERSONNE_TERME}
        blocName="Termes"
        resourceType="persons"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
