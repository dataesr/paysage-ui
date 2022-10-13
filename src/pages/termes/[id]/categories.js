import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function TermsCategories() {
  return (
    <>
      <RelationsByTag
        tag="categories"
        blocName="Catégories"
        resourceType="terms"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="terms"
        blocName="Termes"
        resourceType="terms"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
