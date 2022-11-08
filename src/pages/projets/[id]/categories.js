import RelationsByTag from '../../../components/blocs/relations-by-tag';
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
