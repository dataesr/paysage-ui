import Relations from '../../../components/blocs/relations-by-tag';

export default function StructurePrixEtRecompensesPage() {
  return (
    <Relations
      tag="prix"
      blocName="Prix et récompenses"
      resourceType="prices"
      relatedObjectTypes={['structures']}
      inverse
    />
  );
}
