import { RelationsGouvernance } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import EmailsComponent from '../../../components/blocs/emails';

export default function StructureGouvernancePage() {
  return (
    <RelationsGouvernance
      tag={GOUVERNANCE}
      resourceType="structures"
      relatedObjectTypes={['persons']}
      Form={MandateForm}
      sort="relationType.priority"
      withTabs
      ExtraTab={{
        label: 'Boites email génériques',
        component: <EmailsComponent />,
      }}
    />
  );
}
