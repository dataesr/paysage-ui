import { RelationsByTag } from '../../../components/blocs/relations';
import { PROJET_CATEGORIE, PROJET_TERME } from '../../../utils/relations-tags';

export default function ProjectCategories() {
  return (
    <>
      <RelationsByTag
        tag={PROJET_CATEGORIE}
        blocName="Catégories"
        resourceType="projects"
        relatedObjectTypes={['categories']}
        noRelationType
        sort="relatedObject.priority"
      />
      <RelationsByTag
        tag={PROJET_TERME}
        blocName="Termes"
        resourceType="projects"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
