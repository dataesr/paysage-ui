import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function ProjectCategories() {
  return (
    <>
      <RelationsByTag
        tag="projects-categories"
        blocName="Catégories"
        resourceType="projects"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="projects-terms"
        blocName="Termes"
        resourceType="projects"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
