import Relations from '../../../components/blocs/relations-by-tag';

export default function PersonPrices() {
  return (
    <Relations
      tag="prix"
      blocName="Prix et récompenses"
      resourceType="prices"
      relatedObjectTypes={['projects']}
      inverse
    />
  );
}
