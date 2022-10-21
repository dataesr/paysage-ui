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

  const getOptionsFromFacet = ({ facet, text }) => {
    const energyClasses = {};
    data?.data?.forEach((item) => {
      if (!energyClasses?.[item?.[facet]]) {
        energyClasses[item?.[facet]] = 0;
      }
      energyClasses[item?.[facet]] += 1;
    });

    const sobrietyData = [];
    Object.keys(energyClasses).forEach((item) => sobrietyData.push({ name: `${item}`, y: energyClasses[item] }));
    // KO
    sobrietyData.sort((a, b) => (b?.name?.toLowerCase() || '') - (a?.name?.toLowerCase() || ''));
    return {
      ...commonOptions,
      chart: { type: 'pie' },
      series: [{ data: sobrietyData }],
      title: { text },
    };
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
                options={getOptionsFromFacet({ facet: 'energie_class', text: 'Répartition des classes d\'énergie des bâtiments' })}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={getOptionsFromFacet({ facet: 'ges', text: 'Répartition des GES des bâtiments' })}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
