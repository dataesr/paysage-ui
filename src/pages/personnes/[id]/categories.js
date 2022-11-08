import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PersonCategories() {
  return (
    <>
      <RelationsByTag
        tag="persons-categories"
        blocName="Catégories"
        resourceType="persons"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="persons-terms"
        blocName="Termes"
        resourceType="persons"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
