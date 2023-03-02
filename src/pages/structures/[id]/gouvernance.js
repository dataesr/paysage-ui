import { RelationsByTag } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE, STRUCTURE_REFERENT_MESR } from '../../../utils/relations-tags';

export default function StructureGouvernancePage() {
  return (
    <>
      <RelationsByTag
        tag={GOUVERNANCE}
        blocName="Gouvernance"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        Form={MandateForm}
        sort="relationType.priority"
      />
      <RelationsByTag
        tag={STRUCTURE_REFERENT_MESR}
        blocName="Référents MESR"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        Form={MandateForm}
        noRelationType
      />
    </>
  );
}
