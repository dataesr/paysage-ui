import { Col, Container, Highlight, Icon, Row, Tag, TagGroup, Text, Title } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo, useState } from 'react';
import useFetch from '../../../hooks/useFetch';

const LAST_DAYS_DEFAULT = 7;

export default function Dashboard() {
  const [days, setDays] = useState(LAST_DAYS_DEFAULT);
  const queryDate = useMemo(() => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(), [days]);
  const { data, error } = useFetch(`/dashboard?filters[createdAt][$gte]=${queryDate}`);
  const topUsers = data?.data?.[0]?.byUser.slice(0, 15) || [];
  const topObjects = data?.data?.[0]?.byObject.slice(0, 15) || [];

  return (
    <Container fluid>
      <Row className="fr-mt-3w">
        <TagGroup>
          <Tag size="sm" className="no-span" selected={days === LAST_DAYS_DEFAULT} onClick={() => setDays(7)}>
            {LAST_DAYS_DEFAULT}
            {' '}
            derniers jours
          </Tag>
          <Tag size="sm" className="no-span" selected={days === 30} onClick={() => setDays(30)}>
            30 derniers jours
          </Tag>
          <Tag size="sm" className="no-span" selected={days === 90} onClick={() => setDays(90)}>
            90 derniers jours
          </Tag>
        </TagGroup>
      </Row>
      <hr className="fr-col-xs-10 fr-col-7 fr-mt-1w fr-mb-3w" />
      {error && <Text>Une erreur est survenue</Text>}
      {!error && (
        <Row gutters>
          <Col n="12">
            <>
              <Title as="h2" look="h5" className="fr-mb-2w">
                <Icon name="ri-user-line" />
                Utilisateurs ayant le plus contribué
              </Title>
              <Highlight colorFamily="yellow-tournesol" size="sm" className="fr-ml-0 fr-my-1w">
                <i>
                  Liste limitée aux 15 utilisateurs les plus actifs au cours des
                  {' '}
                  {days}
                  {' '}
                  derniers jours
                </i>
              </Highlight>
            </>
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: { type: 'bar' },
                credits: { enabled: false },
                legend: { enabled: false },
                accessibility: { enabled: false },
                series: [
                  { data: topUsers.map((item) => item.totalOperations), name: "Nombre d'opérations" },
                ],
                title: { text: null },
                xAxis: { categories: topUsers.map((item) => item.displayName), title: null },
                yAxis: { title: null },
              }}
            />
          </Col>
          <Col n="12">
            <>
              <Title as="h2" look="h5" className="fr-mb-2w">
                <Icon name="ri-user-line" />
                Top 15 des créations d'objets
              </Title>
              <Highlight colorFamily="yellow-tournesol" size="sm" className="fr-ml-0 fr-my-1w">
                <i>
                  Chaque barre représente le nombre d'objets de ce type crées au cours des
                  {' '}
                  {days}
                  {' '}
                  derniers jours
                </i>
              </Highlight>
            </>
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: { type: 'bar' },
                credits: { enabled: false },
                legend: { enabled: false },
                series: [
                  { data: topObjects.map((item) => item.totalOperations), name: "Nombre d'opérations" },
                ],
                title: { text: null },
                xAxis: { categories: topObjects.map((item) => item.displayName), title: null },
                yAxis: { title: null },
              }}
            />
          </Col>
        </Row>
      )}

    </Container>
  );
}
