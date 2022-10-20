import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';

export default function StructureImmobilierPage() {
  const { url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/real-estate?filters[annee]=2022&limit=9999`);
  const commonOptions = {
    credits: { enabled: false },
    // xAxis: { categories },
  };

  const energyClasses = {};
  data?.data?.forEach((item) => {
    if (!energyClasses?.[item?.energie_class]) {
      energyClasses[item?.energie_class] = 0;
    }
    energyClasses[item?.energie_class] += 1;
  });

  // Graph 1: Pie about the energy class
  const sobrietyData = [{
    name: 'A',
    y: energyClasses?.A || 0,
  }, {
    name: 'B',
    y: energyClasses?.B || 0,
  }, {
    name: 'C',
    y: energyClasses?.C || 0,
  }, {
    name: 'D',
    y: energyClasses?.D || 0,
  }, {
    name: 'E',
    y: energyClasses?.E || 0,
  }, {
    name: 'F',
    y: energyClasses?.F || 0,
  }, {
    name: 'Non défini',
    y: energyClasses?.undefined || 0,
  }];
  const sobrietyOptions = {
    ...commonOptions,
    chart: { type: 'pie' },
    series: [{ data: sobrietyData }],
    title: { text: 'Répartition des classes d\'énergie des batiments' },
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Title as="h3">
        <Icon name="ri-community-fill" className="fr-pl-1w" />
        Immobilier en 2022
      </Title>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Sobriété
        </BlocTitle>
        <BlocContent>
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={sobrietyOptions}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
