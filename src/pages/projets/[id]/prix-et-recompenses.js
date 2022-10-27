import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PersonPrices() {
  return (
    <RelationsByTag
      tag="prix"
      blocName="Prix et récompenses"
      resourceType="prices"
      relatedObjectTypes={['projects']}
      inverse
    />
  );
}
