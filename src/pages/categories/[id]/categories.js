import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function TermsCategories() {
  return (
    <>
      <RelationsByTag
        tag="categories"
        blocName="Catégories"
        resourceType="categories"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="terms"
        blocName="Termes"
        resourceType="categories"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
