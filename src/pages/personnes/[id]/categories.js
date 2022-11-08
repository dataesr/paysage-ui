import RelationsByTag from '../../../components/blocs/relations-by-tag';
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
