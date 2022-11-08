import RelationsByTag from '../../../components/blocs/relations-by-tag';

export default function PersonMandats() {
  return (
    <>
      <RelationsByTag
        blocName="Mandats"
        tag="gouvernance"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        inverse
      />
      <RelationsByTag
        tag="referentMESR"
        blocName="Référent MESR"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        inverse
      />
    </>
  );
}
