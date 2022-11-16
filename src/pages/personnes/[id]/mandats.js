import RelationsByTag from '../../../components/blocs/relations-by-tag';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE, STRUCTURE_REFERENT_MESR } from '../../../utils/relations-tags';

export default function PersonMandats() {
  return (
    <>
      <RelationsByTag
        blocName="Mandats"
        tag={GOUVERNANCE}
        resourceType="structures"
        relatedObjectTypes={['persons']}
        Form={MandateForm}
        inverse
        sortByEndDate
      />
      <RelationsByTag
        tag={STRUCTURE_REFERENT_MESR}
        blocName="Référent MESR"
        resourceType="structures"
        relatedObjectTypes={['persons']}
        Form={MandateForm}
        inverse
        sortByEndDate
      />
    </>
  );
}
