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
  const year = lastData?.annee_universitaire || '';
  const categories = sortedData.map((item) => item.annee);
  const commonOptions = {
    credits: { enabled: false },
    xAxis: { categories },
  };

  const tiles = [{
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
  }];

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
    ...commonOptions,
    chart: { type: 'pie' },
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
    ...commonOptions,
    chart: { type: 'pie' },
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

  const tiles2 = [{
    text: 'étudiants inscrits préparant un diplôme d\'accès aux études universitaires',
    value: lastData?.diplomedaeu,
  }, {
    text: 'étudiants inscrits en Capacité en droit',
    value: lastData?.diplomecapa,
  }, {
    text: 'étudiants inscrits en Licence',
    value: lastData?.diplomelic_l_aut,
  }, {
    text: 'étudiants inscrits préparant un diplôme universitaire de technologie',
    value: lastData?.diplomedut,
  }, {
    text: 'étudiants inscrits en Licence professionnelle',
    value: lastData?.diplomelic_pro,
  }, {
    text: 'étudiants inscrits en Master',
    value: (lastData?.diplomemast_m_autres || 0) + (lastData?.diplomemast_m_enseignement || 0),
  }, {
    text: 'étudiants inscrits en Master enseignement',
    value: lastData?.diplomemast_m_enseignement,
    prefix: 'dont',
  }, {
    text: 'étudiants inscrits en formations d\'ingénieurs',
    value: lastData?.diplomeing,
  }, {
    text: 'étudiants inscrits en PACES',
    value: lastData?.diplomesante_paces,
  }, {
    text: 'étudiants inscrits dans les formations paramédicales',
    value: lastData?.diplomesante_paramedical,
  }, {
    text: 'étudiants inscrits dans les autres formations de santé',
    value: lastData?.diplomesante_autres_form,
  }, {
    text: 'étudiants inscrits dans les diplômes d\'établissement',
    value: lastData?.diplomedu,
  }];

  const populationOptions = {
    ...commonOptions,
    series: [{
      name: lastData?.etablissement_lib || 'Structure sans nom',
      data: sortedData.map((item) => item?.effectif || 0),
    }],
    title: { text: 'Evolution des effectifs' },
  };

  const populationCycleOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits en 1er cycle',
        data: sortedData.map((item) => item?.cursus_lmdl || 0),
      },
      {
        name: 'Etudiants inscrits en 2ème cycle',
        data: sortedData.map((item) => item?.cursus_lmdm || 0),
      },
      {
        name: 'Etudiants inscrits en 3ème cycle',
        data: sortedData.map((item) => item?.cursus_lmdd || 0),
      },
    ],
    title: { text: 'Évolution des effectifs par cycle' },
  };

  const populationDisciplineOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits en Droit, sciences économiques, AES',
        data: sortedData.map((item) => item?.gd_discisciplinedsa || 0),
      },
      {
        name: 'Etudiants inscrits en Lettres, langues et sciences humaines',
        data: sortedData.map((item) => item?.gd_discisciplinellsh || 0),
      },
      {
        name: 'Etudiants inscrits en Sciences et sciences de l\'ingénieur',
        data: sortedData.map((item) => item?.gd_discisciplinesi || 0),
      },
      {
        name: 'Etudiants inscrits en STAPS',
        data: sortedData.map((item) => item?.gd_discisciplinestaps || 0),
      },
      {
        name: 'Etudiants inscrits en Santé',
        data: sortedData.map((item) => item?.gd_discisciplinesante || 0),
      },
    ],
    title: { text: 'Évolution des effectifs par discipline' },
  };

  const populationDiplomaOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits préparant un diplôme universitaire de technologie',
        data: sortedData.map((item) => item?.diplomedut || 0),
      },
      {
        name: 'Etudiants inscrits en Licence',
        data: sortedData.map((item) => item?.diplomelic_l_aut || 0),
      },
      {
        name: 'Etudiants inscrits en Master',
        data: sortedData.map((item) => (item?.diplomemast_m_autres || 0) + (item?.diplomemast_m_enseignement || 0)),
      },
      {
        name: 'Etudiants inscrits en formations d\'ingénieurs',
        data: sortedData.map((item) => item?.diplomeing || 0),
      },
      {
        name: 'Etudiants inscrits en Doctorat',
        data: sortedData.map((item) => item?.diplomehdr || 0),
      },
    ],
    title: { text: 'Évolution des effectifs dans les principaux diplômes' },
  };

  const populationOtherDiplomaOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits préparant un diplôme d\'accès aux études universitaires',
        data: sortedData.map((item) => item?.diplomedaeu || 0),
      },
      {
        name: 'Etudiants inscrits en Capacité en droit',
        data: sortedData.map((item) => item?.diplomecapa || 0),
      },
      {
        name: 'Etudiants inscrits en Licence professionnelle',
        data: sortedData.map((item) => item?.diplomelic_pro || 0),
      },
      {
        name: 'Etudiants inscrits en Master enseignement (dont)',
        data: sortedData.map((item) => item?.diplomemast_m_enseignement || 0),
      },
      {
        name: 'Etudiants inscrits en PACES',
        data: sortedData.map((item) => item?.diplomesante_paces || 0),
      },
      {
        name: 'Etudiants inscrits dans les formations paramédicales',
        data: sortedData.map((item) => item?.diplomesante_paramedical || 0),
      },
      {
        name: 'Etudiants inscrits dans les autres formations de santé',
        data: sortedData.map((item) => item?.diplomesante_autres_form || 0),
      },
      {
        name: 'Etudiants inscrits en HDR',
        data: sortedData.map((item) => item?.diplomehdr || 0),
      },
      {
        name: 'Etudiants inscrits dans les diplômes d\'établissement',
        data: sortedData.map((item) => item?.diplomeautres_form || 0),
      },
    ],
    title: { text: 'Évolution des effectifs dans d\'autres types de diplômes' },
  };

  const rateMobilityOptions = {
    ...commonOptions,
    series: [{
      data: sortedData.map((item) => ((item?.mobilite_internm || 0) / item.effectif) * 100),
    }],
    title: { text: 'Évolution de la part des étudiants inscrits en mobilité internationale (en %)' },
  };

  const rateNewBachelorsOptions = {
    ...commonOptions,
    series: [{
      name: '% de nouveaux bacheliers issus d\'un bac général',
      data: sortedData.map((item) => ((item?.nbaca || 0) / item.nouv_bachelier) * 100),
    }, {
      name: '% de nouveaux bacheliers issus d\'un bac technologique',
      data: sortedData.map((item) => (((item?.nouv_bachelier || 0) - ((item?.nbaca || 0) + (item?.nbac6 || 0))) / item.nouv_bachelier) * 100),
    }, {
      name: '% de nouveaux bacheliers issus d\'un bac professionnel',
      data: sortedData.map((item) => ((item?.nbac6 || 0) / item.nouv_bachelier) * 100),
    }],
    title: { text: 'Répartitions des nouveaux bacheliers' },
  };

  const ageNewBachelorsOptions = {
    ...commonOptions,
    series: [{
      name: '% de nouveaux bacheliers en avance au bac d\'un an ou plus',
      data: sortedData.map((item) => ((item?.nbac_ageavance || 0) / item.nouv_bachelier) * 100),
    }, {
      name: '% de nouveaux bacheliers à l\'heure au bac',
      data: sortedData.map((item) => ((item?.nbac_agea_l_heure || 0) / item.nouv_bachelier) * 100),
    }, {
      name: '% de nouveaux bacheliers en retard au bac d\'un an ou plus',
      data: sortedData.map((item) => ((item?.nbac_ageretard || 0) / item.nouv_bachelier) * 100),
    }],
    title: { text: 'Âge au bac des nouveaux bacheliers' },
  };

  const renderCards = (all) => {
    const list = all
      .filter((item) => item?.value)
      .map((item) => {
        let title = item.value.toLocaleString('fr-FR');
        const total = item?.percentTotal ? item.percentTotal : lastData?.effectif;
        if (item?.isPercent === undefined && total) title += ` (${cleanNumber((item.value / total) * 100)} %)`;
        title = item?.prefix ? `${item.prefix} ${title}` : title;
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
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">
        {`Situation en ${year} - Source : SISE`}
      </BlocTitle>
      <BlocContent>
        {renderCards(tiles)}
        <HighchartsReact
          highcharts={Highcharts}
          options={LMDOptions}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={disciplinesOptions}
        />
        {renderCards(tiles2)}
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
        <HighchartsReact
          highcharts={Highcharts}
          options={populationDiplomaOptions}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={populationOtherDiplomaOptions}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={rateMobilityOptions}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={rateNewBachelorsOptions}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={ageNewBachelorsOptions}
        />
      </BlocContent>
    </Bloc>
  );
}
