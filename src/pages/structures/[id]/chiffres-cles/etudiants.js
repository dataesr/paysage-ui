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
    value: lastData?.nbaca,
    percentTotal: lastData?.nouv_bachelier,
  }, {
    text: 'nouveaux bacheliers issus d\'un bac technologique',
    value: (lastData?.nouv_bachelier || 0) - ((lastData?.nbaca || 0) + (lastData?.nbac6 || 0)),
    percentTotal: lastData?.nouv_bachelier,
  }, {
    text: 'nouveaux bacheliers issus d\'un bac professionnel',
    value: lastData?.nbac6,
    percentTotal: lastData?.nouv_bachelier,
  }, {
    text: 'nouveaux bacheliers en avance au bac d\'un an ou plus',
    value: lastData?.nbac_ageavance,
    percentTotal: lastData?.nouv_bachelier,
  }, {
    text: 'nouveaux bacheliers en retard au bac d\'un an ou plus',
    value: lastData?.nbac_ageretard,
    percentTotal: lastData?.nouv_bachelier,
  }]);

  let LMDData = [];
  let disciplinesData = [];
  if (lastData?.effectif) {
    // Graph 1: Pie about the population by cycle
    const totalPopulation = lastData.effectif;
    const firstCyclePopulation = lastData?.cursus_lmdl || 0;
    const firstCyclePopulationRate = (firstCyclePopulation / totalPopulation) * 100;
    const secondCyclePopulation = lastData?.cursus_lmdm || 0;
    const secondCyclePopulationRate = (secondCyclePopulation / totalPopulation) * 100;
    const thirdCyclePopulation = lastData?.cursus_lmdd || 0;
    const thirdCyclePopulationRate = (thirdCyclePopulation / totalPopulation) * 100;
    LMDData = [{
      name: '1er cycle',
      tooltipName: `${firstCyclePopulation.toLocaleString('fr-FR')} étudiants inscrits en 1er cycle (${cleanNumber(firstCyclePopulationRate)} %)`,
      y: firstCyclePopulationRate,
    }, {
      name: '2ème cycle',
      tooltipName: `${secondCyclePopulation.toLocaleString('fr-FR')} étudiants inscrits en 2ème cycle (${cleanNumber(secondCyclePopulationRate)} %)`,
      y: secondCyclePopulationRate,
    }, {
      name: '3ème cycle',
      tooltipName: `${thirdCyclePopulation.toLocaleString('fr-FR')} étudiants inscrits en 3ème cycle (${cleanNumber(thirdCyclePopulationRate)} %)`,
      y: thirdCyclePopulationRate,
    }];
    // Graph 2: Pie about the population by discipline
    const DSAPopulation = lastData?.gd_discisciplinedsa || 0;
    const DSAPopulationRate = (DSAPopulation / totalPopulation) * 100;
    const LLSHPopulation = lastData?.gd_discisciplinellsh || 0;
    const LLSHPopulationRate = (LLSHPopulation / totalPopulation) * 100;
    const SIPopulation = lastData?.gd_discisciplinesi || 0;
    const SIPopulationRate = (SIPopulation / totalPopulation) * 100;
    const stapsPopulation = lastData?.gd_discisciplinestaps || 0;
    const stapsPopulationRate = (stapsPopulation / totalPopulation) * 100;
    const santePopulation = lastData?.gd_discisciplinesante || 0;
    const santePopulationRate = (santePopulation / totalPopulation) * 100;
    disciplinesData = [{
      name: 'Droit, sciences économiques, AES',
      tooltipName: `${DSAPopulation.toLocaleString('fr-FR')} étudiants inscrits en Droit, sciences économiques, AES (${cleanNumber(DSAPopulationRate)} %)`,
      y: DSAPopulationRate,
    }, {
      name: 'Lettres, langues et sciences humaines',
      tooltipName: `${LLSHPopulation.toLocaleString('fr-FR')} étudiants inscrits en Droit, sciences économiques, AES (${cleanNumber(LLSHPopulationRate)} %)`,
      y: LLSHPopulationRate,
    }, {
      name: 'Sciences et sciences de l\'ingénieur',
      tooltipName: `${SIPopulation.toLocaleString('fr-FR')} étudiants inscrits en Droit, sciences économiques, AES (${cleanNumber(SIPopulationRate)} %)`,
      y: SIPopulationRate,
    }, {
      name: 'STAPS',
      tooltipName: `${stapsPopulation.toLocaleString('fr-FR')} étudiants inscrits en Droit, sciences économiques, AES (${cleanNumber(stapsPopulationRate)} %)`,
      y: stapsPopulationRate,
    }, {
      name: 'Santé',
      tooltipName: `${santePopulation.toLocaleString('fr-FR')} étudiants inscrits en Droit, sciences économiques, AES (${cleanNumber(santePopulationRate)} %)`,
      y: santePopulationRate,
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
  const disciplinesOptions = {
    chart: { type: 'pie' },
    credits: { enabled: false },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data: disciplinesData,
    }],
    title: { text: 'Répartition des effectifs par grande discipline' },
    tooltip: {
      // eslint-disable-next-line object-shorthand, func-names, react/no-this-in-sfc
      formatter: function () { return this.point.tooltipName; },
    },
  };

  const categories = sortedData.map((item) => item.annee);
  const populationData = sortedData.map((item) => item?.effectif || 0);
  const populationOptions = ({
    credits: { enabled: false },
    series: [{ name, data: populationData }],
    title: { text: 'Evolution des effectifs' },
    xAxis: { categories },
  });

  const populationDataLicence = sortedData.map((item) => item?.cursus_lmdl || 0);
  const populationDataMaster = sortedData.map((item) => item?.cursus_lmdm || 0);
  const populationDataDoctorat = sortedData.map((item) => item?.cursus_lmdd || 0);
  const populationCycleOptions = ({
    credits: { enabled: false },
    series: [
      { name: 'Etudiants inscrits en 1er cycle', data: populationDataLicence },
      { name: 'Etudiants inscrits en 2ème cycle', data: populationDataMaster },
      { name: 'Etudiants inscrits en 3ème cycle', data: populationDataDoctorat },
    ],
    title: { text: 'Évolution des effectifs par cycle' },
    xAxis: { categories },
  });

  const populationDataDSA = sortedData.map((item) => item?.gd_discisciplinedsa || 0);
  const populationDataLLSH = sortedData.map((item) => item?.gd_discisciplinellsh || 0);
  const populationDataSI = sortedData.map((item) => item?.gd_discisciplinesi || 0);
  const populationDataStaps = sortedData.map((item) => item?.gd_discisciplinestaps || 0);
  const populationDataSante = sortedData.map((item) => item?.gd_discisciplinesante || 0);
  const populationDisciplineOptions = ({
    credits: { enabled: false },
    series: [
      { name: 'Etudiants inscrits en Droit, sciences économiques, AES', data: populationDataDSA },
      { name: 'Etudiants inscrits en Lettres, langues et sciences humaines', data: populationDataLLSH },
      { name: 'Etudiants inscrits en Sciences et sciences de l\'ingénieur', data: populationDataSI },
      { name: 'Etudiants inscrits en STAPS', data: populationDataStaps },
      { name: 'Etudiants inscrits en Santé', data: populationDataSante },
    ],
    title: { text: 'Évolution des effectifs par discipline' },
    xAxis: { categories },
  });

  const renderCards = (all) => {
    const list = all
      .filter((item) => item?.value)
      .map((item) => {
        let title = item.value.toLocaleString('fr-FR');
        const total = item?.percentTotal ? item.percentTotal : lastData?.effectif;
        if (item?.isPercent === undefined && total) title += ` (${cleanNumber((item.value / total) * 100)} %)`;
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
        options={LMDOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={disciplinesOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={populationOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={populationCycleOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={populationDisciplineOptions}
      />
    </>
  );
}
