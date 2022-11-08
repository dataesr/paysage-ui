import RelationsByTag from '../../../components/blocs/relations-by-tag';
import MandateForm from '../../../components/forms/mandate';

export default function StructureGouvernancePage() {
  return (
    <>
      <RelationsByTag
        tag="gouvernance"
        blocName="Gouvernance"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        Form={MandateForm}
      />
      <RelationsByTag
        tag="referentMESR"
        blocName="Référents MESR"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        Form={MandateForm}
      />
    </>
  );
}
