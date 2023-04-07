import { RelationsByTag } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE } from '../../../utils/relations-tags';

export default function PersonMandats() {
  return (
    <RelationsByTag
      blocName="Mandats"
      tag={GOUVERNANCE}
      resourceType="structures"
      relatedObjectTypes={['persons']}
      Form={MandateForm}
      inverse
      sort="relationType.priority"
    />
  );
}
