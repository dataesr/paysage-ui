import { Col, Row, Tabs, Tab } from '@dataesr/react-dsfr';
import { RelationsGouvernance } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import EmailsComponent from '../../../components/blocs/emails';

export default function StructureGouvernancePage() {
  return (
    <Row gutters>
      <Tabs>
        <Tab
          label="Gouvernance"
          className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border"
        >
          <Row style={{ overflowY: 'scroll' }}>
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
        </Tab>
        <Tab
          label="Contacts"
          className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border"
        >
          <Row style={{ overflowY: 'scroll' }}>
            <Col n="12">
              <EmailsComponent />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Row>
  );
}
