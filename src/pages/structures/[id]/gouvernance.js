import { Col, Row } from '@dataesr/react-dsfr';
import { RelationsGouvernance } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import EmailsComponent from '../../../components/blocs/emails';

export default function StructureGouvernancePage() {
  return (
    <Row gutters>
      <Col n="12">
        <EmailsComponent />
      </Col>
      <Col n="12">
        <RelationsGouvernance
          tag={GOUVERNANCE}
          blocName="Gouvernance, administration et référents"
          resourceType="structures"
          relatedObjectTypes={['persons']}
          Form={MandateForm}
          sort="relationType.priority"
        />
      </Col>
    </Row>
  );
}
