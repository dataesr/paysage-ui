import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function StructureCategoriesPage() {
  return (
    <>
      <RelationsByTag
        tag="structures-legal-categories"
        blocName="Catégories juridiques"
        resourceType="structures"
        relatedObjectTypes={['legal-categories']}
        noRelationType
      />
      <RelationsByTag
        tag="structures-categories"
        blocName="Catégories"
        resourceType="structures"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="structures-terms"
        blocName="Termes"
        resourceType="structures"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
