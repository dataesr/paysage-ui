import { Col, Row, Tabs, Tab } from '@dataesr/react-dsfr';
import { RelationsGouvernance } from '../../../components/blocs/relations';
import MandateForm from '../../../components/forms/mandate';
import { GOUVERNANCE } from '../../../utils/relations-tags';
import EmailsComponent from '../../../components/blocs/emails';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { GROUP_ORDER } from '../../../components/blocs/relations/components/relations-gouvernance';

export default function StructureGouvernancePage() {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${GOUVERNANCE}&filters[resourceId]=${resourceId}&limit=2000&sort=relationType.priority`;
  const { data } = useFetch(url);

  const grouped = {};
  if (Array.isArray(data?.data)) {
    data.data.forEach((rel) => {
      const group = rel?.relationType?.mandateTypeGroup || 'Autres';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(rel);
    });
  }

  const sortedGroups = GROUP_ORDER.filter((group) => grouped[group] && grouped[group].length > 0);

  return (
    <Row gutters>
      <Tabs className="fr-mt-3w">
        {sortedGroups.map((group) => (
          <Tab
            key={group}
            label={group}
            className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border"
          >
            <Row style={{ overflowY: 'scroll' }}>
              <Col n="12">
                <RelationsGouvernance
                  tag={GOUVERNANCE}
                  blocName={group}
                  resourceType="structures"
                  relatedObjectTypes={['persons']}
                  Form={MandateForm}
                  sort="relationType.priority"
                  mandateTypeGroup={group}
                />
              </Col>
            </Row>
          </Tab>
        ))}
        <Tab
          label="Boites email génériques"
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
