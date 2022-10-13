import { Row, Text } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import ExpendableListCards from '../../../../components/card/expendable-list-cards';
import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useHashScroll from '../../../../hooks/useHashScroll';
import cleanNumber from '../../../../hooks/useNumbers';
import useUrl from '../../../../hooks/useUrl';

export default function StructureEtudiantsPage() {
  useHashScroll();
  const { url } = useUrl('keynumbers');
  const { data, isLoading, error } = useFetch(`${url}/population`);

  const sortedData = data?.data.sort((a, b) => a.annee - b.annee) || [];
  const lastData = sortedData?.[sortedData.length - 1];
  const name = lastData?.etablissement_lib || 'Structure sans nom';
  const year = lastData?.annee_universitaire || '';

  const tiles = ([{
    text: 'inscriptions totales (inscriptions principales et secondes)',
    value: lastData?.effectif_total,
    isPercent: false,
  }, {
    text: 'étudiants inscrits (inscriptions principales)',
    value: lastData?.effectif,
    isPercent: false,
  }, {
    text: 'étudiants inscrits hors doubles inscriptions CPGE',
    value: lastData?.effectif_sans_cpge,
  }, {
    text: 'étudiantes inscrites (inscriptions principales)',
    value: lastData?.sexef,
  }, {
    text: 'étudiants inscrits ayant obtenu leur bac dans le même département',
    value: lastData?.attrac_nat_dep_bac1,
  }, {
    text: 'étudiants inscrits ayant obtenu leur bac dans un département limitrophe',
    value: lastData?.attrac_nat_dep_bac2,
  }, {
    text: 'étudiants inscrits ayant obtenu leur bac dans un autre département français',
    value: lastData?.attrac_nat_dep_bac3,
  }, {
    text: 'étudiants inscrits en mobilité internationale',
    value: lastData?.mobilite_internm,
  }, {
    text: 'nouveaux bacheliers',
    value: lastData?.nouv_bachelier,
  }, {
    text: 'nouveaux bacheliers issus d\'un bac général',
    value: 42,
    isPercent: false,
  }, {
    text: 'nouveaux bacheliers issus d\'un bac technologique',
    value: 42,
    isPercent: false,
  }, {
    text: 'nouveaux bacheliers issus d\'un bac professionnel',
    value: 42,
    isPercent: false,
  }, {
    text: 'nouveaux bacheliers en avance au bac d\'un an ou plus',
    value: 42,
    isPercent: false,
  }, {
    text: 'nouveaux bacheliers en retard au bac d\'un an ou plus',
    value: 42,
    isPercent: false,
  }]);

  const populationData = sortedData.map((item) => item?.effectif || 0);
  const populationCategories = sortedData.map((item) => item.annee);
  const populationOptions = ({
    credits: { enabled: false },
    series: [{ name, data: populationData }],
    title: { text: 'Evolution des effectifs' },
    xAxis: { categories: populationCategories },
  });

  let LMDData = [];
  if (lastData?.effectif && lastData?.cursus_lmdl) {
    const totalPopulation = lastData.effectif;
    const firstCyclePopulation = lastData.cursus_lmdl;
    const firstCyclePopulationRate = (firstCyclePopulation / totalPopulation) * 100;
    const secondCyclePopulation = totalPopulation - firstCyclePopulation;
    const secondCyclePopulationRate = (secondCyclePopulation / totalPopulation) * 100;
    LMDData = [{
      name: '1er cycle',
      tooltipName: `${firstCyclePopulation.toLocaleString('fr-FR')} étudiants inscrits en 1er cycle (${cleanNumber(firstCyclePopulationRate)} %)`,
      y: firstCyclePopulationRate,
    }, {
      name: '2ème cycle',
      tooltipName: `${secondCyclePopulation.toLocaleString('fr-FR')} étudiants inscrits en 2ème cycle (${cleanNumber(secondCyclePopulationRate)} %)`,
      y: secondCyclePopulationRate,
    }];
  }
  const LMDOptions = {
    chart: { type: 'pie' },
    credits: { enabled: false },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data: LMDData,
    }],
    title: { text: 'Répartition des effectifs par cycle LMD' },
    tooltip: {
      // eslint-disable-next-line object-shorthand, func-names, react/no-this-in-sfc
      formatter: function () { return this.point.tooltipName; },
    },
  };

  const renderCards = (all) => {
    const list = all
      .filter((item) => item?.value)
      .map((item) => {
        // valuePercent
        let title = item.value.toLocaleString('fr-FR');
        if (item?.isPercent === undefined || item.isPercent) title += ` (${cleanNumber((item.value / lastData.effectif) * 100)} %)`;
        return (
          <Card
            title={title}
            descriptionElement={(
              <Row alignItems="middle">
                <Text spacing="mr-1v mb-0">{item.text}</Text>
              </Row>
            )}
          />
        );
      });
    return <ExpendableListCards list={list} nCol="12 md-4" max="99" />;
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h3" look="h6">
          {`Situation en ${year} - Source : SISE`}
        </BlocTitle>
        <BlocContent>
          {renderCards(tiles)}
        </BlocContent>
      </Bloc>
      <HighchartsReact
        highcharts={Highcharts}
        options={populationOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={LMDOptions}
      />
    </>
  );
}
