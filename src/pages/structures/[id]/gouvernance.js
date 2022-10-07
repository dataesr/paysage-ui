import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function StructureGouvernancePage() {
  return (
    <>
      <RelationsByTag
        tag="gouvernance"
        blocName="Gouvernance"
        resourceType="structures"
        relatedObjectTypes={['persons']}
      />
      <RelationsByTag
        tag="referentMESR"
        blocName="Référents MESR"
        resourceType="structures"
        relatedObjectTypes={['persons']}
      />
      <RelationsByTag
        tag="referentAutre"
        blocName="Référents DGQuelqueChose"
        resourceType="structures"
        relatedObjectTypes={['persons']}
      />
    </>
  );
}
