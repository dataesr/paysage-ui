import { RelationsGouvernance } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE } from '../../../utils/relations-tags';

export default function StructureGouvernancePage() {
  return (
    <RelationsGouvernance
      tag={GOUVERNANCE}
      blocName="Gouvernance"
      resourceType="structures"
      relatedObjectTypes={['persons']}
      Form={MandateForm}
      sort="relationType.priority"
    />
  );
}
