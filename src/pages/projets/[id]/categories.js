import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function ProjectCategories() {
  return (
    <>
      <RelationsByTag
        tag="categories"
        blocName="Catégories"
        resourceType="projects"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="terms"
        blocName="Termes"
        resourceType="projects"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
