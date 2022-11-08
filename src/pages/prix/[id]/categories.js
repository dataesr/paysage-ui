import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PriceCategories() {
  return (
    <>
      <RelationsByTag
        tag="prices-categories"
        blocName="Catégories"
        resourceType="prices"
        relatedObjectTypes={['categories']}
        noRelationType
      />
      <RelationsByTag
        tag="prices-terms"
        blocName="Termes"
        resourceType="prices"
        relatedObjectTypes={['terms']}
        noRelationType
      />
    </>
  );
}
