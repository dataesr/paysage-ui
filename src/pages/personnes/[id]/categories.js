import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PersonCategories() {
  return (
    <>
      <RelationsByTag
        tag="categories"
        blocName="Catégories"
        resourceType="persons"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="terms"
        blocName="Termes"
        resourceType="persons"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
