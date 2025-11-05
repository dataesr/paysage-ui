import { Col, Icon, Row, Text, Title } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import ExpendableListCards from '../../../../components/card/expendable-list-cards';
import WeblinkCard from '../../../../components/card/weblink-card';
import { Spinner } from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import cleanNumber from '../../../../utils/clean-numbers';

HCExporting(Highcharts);
HCExportingData(Highcharts);

export default function StructureEtudiantsPage() {
  const { id, url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/population?sort=annee_universitaire&limit=40`);

  // eslint-disable-next-line no-nested-ternary
  const allData = data?.data || [];
  const lastData = allData?.[allData.length - 1];
  const year = lastData?.annee_universitaire || '';
  const categories = allData.map((item) => item.annee_universitaire);
  const commonOptions = {
    credits: { enabled: false },
    lang: {
      downloadCSV: 'Télécharger en CSV',
      downloadJPEG: 'Téléchager en JPEG',
      downloadPDF: 'Télécharger en PDF',
      downloadPNG: 'Télécharger en PNG',
      downloadSVG: 'Télécharger en SVG',
      downloadXLS: 'Télécharger en XLS',
      printChart: 'Imprimer le graphique',
      viewFullscreen: 'Plein écran',
    },
    xAxis: { categories },
    yAxis: { title: { text: 'Nombre d\'étudiants' } },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            'viewFullscreen', 'printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF',
            'downloadSVG', 'separator', 'downloadCSV', 'downloadXLS', 'openInCloud',
          ],
        },
      },
    },
  };

  const tiles = [{
    text: 'inscriptions totales (inscriptions principales et secondes)',
    value: lastData?.effectif_total,
    isPercent: false,
  }, {
    text: 'inscriptions totales hors doubles inscriptions CPGE (inscriptions principales et secondes)',
    value: lastData?.effectif_total_sans_cpge,
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
    text: 'nouveaux bacheliers hors doubles inscriptions CPGE',
    value: lastData?.nouv_bachelier_sans_cpge,
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
      value: firstCyclePopulation,
      y: firstCyclePopulationRate,
    }, {
      name: '2ème cycle',
      value: secondCyclePopulation,
      y: secondCyclePopulationRate,
    }, {
      name: '3ème cycle',
      value: thirdCyclePopulation,
      y: thirdCyclePopulationRate,
    }];
    // Graph 2: Pie about the population by discipline
    const DSAPopulation = lastData?.gd_discisciplinedsa || 0;
    const DSAPopulationRate = (DSAPopulation / totalPopulation) * 100;
    const LLSHPopulation = lastData?.gd_discisciplinellsh || 0;
    const LLSHPopulationRate = (LLSHPopulation / totalPopulation) * 100;
    const THEOpopulation = lastData?.gd_discisciplinetheo || 0;
    const THEOPopulationRate = (THEOpopulation / totalPopulation) * 100;
    const SIPopulation = lastData?.gd_discisciplinesi || 0;
    const SIPopulationRate = (SIPopulation / totalPopulation) * 100;
    const stapsPopulation = lastData?.gd_discisciplinestaps || 0;
    const stapsPopulationRate = (stapsPopulation / totalPopulation) * 100;
    const santePopulation = lastData?.gd_discisciplinesante || 0;
    const santePopulationRate = (santePopulation / totalPopulation) * 100;
    const vetoPopulation = lastData?.gd_discisciplineveto || 0;
    const vetoPopulationRate = (vetoPopulation / totalPopulation) * 100;
    const interdPopulation = lastData?.gd_discisciplineinterd || 0;
    const interdPopulationRate = (interdPopulation / totalPopulation) * 100;
    disciplinesData = [{
      name: 'Droit, sciences économiques, AES',
      value: DSAPopulation,
      y: DSAPopulationRate,
    }, {
      name: 'Lettres, langues et sciences humaines',
      value: LLSHPopulation,
      y: LLSHPopulationRate,
    }, {
      name: 'Théologie',
      value: THEOpopulation,
      y: THEOPopulationRate,
    }, {
      name: 'Sciences et sciences de l\'ingénieur',
      value: SIPopulation,
      y: SIPopulationRate,
    }, {
      name: 'STAPS',
      value: stapsPopulation,
      y: stapsPopulationRate,
    }, {
      name: 'Santé',
      value: santePopulation,
      y: santePopulationRate,
    }, {
      name: 'Vétérinaire',
      value: vetoPopulation,
      y: vetoPopulationRate,
    }, {
      name: 'Interdisciplinaire',
      value: interdPopulation,
      y: interdPopulationRate,
    }];
  }
  const LMDOptions = {
    ...commonOptions,
    chart: { type: 'pie' },
    series: [{ data: LMDData }],
    title: { text: 'Répartition des effectifs par cycle LMD' },
    tooltip: {
      // eslint-disable-next-line react/no-this-in-sfc
      formatter() { return `<b>${this.point.value.toLocaleString('fr-FR')}</b> étudiants inscrits en ${this.point.name} (${cleanNumber(this.point.y)} %)`; },
    },
  };
  const disciplinesOptions = {
    ...commonOptions,
    chart: { type: 'pie' },
    series: [{ data: disciplinesData }],
    title: { text: 'Répartition des effectifs par grande discipline' },
    tooltip: {
      // eslint-disable-next-line react/no-this-in-sfc
      formatter() { return `<b>${this.point.value.toLocaleString('fr-FR')}</b> étudiants inscrits en ${this.point.name} (${cleanNumber(this.point.y)} %)`; },
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
    value: (lastData?.diplomelic_l_lic_l || 0) + (lastData?.diplomelic_l_las || 0) + (lastData?.diplomelic_l_lsps || 0) + (lastData?.diplomelic_l_cpes || 0),
  }, {
    text: 'étudiants inscrits en Licence accès santé',
    value: lastData?.diplomelic_l_las,
    prefix: 'dont',
  }, {
    text: 'étudiants inscrits en Licence sciences pour la santé',
    value: lastData?.diplomelic_l_lsps,
    prefix: 'dont',
  }, {
    text: 'étudiants inscrits préparant un bachelor universitaire de technologie',
    value: lastData?.diplomebut,
  }, {
    text: 'étudiants inscrits préparant un diplôme universitaire de technologie',
    value: lastData?.diplomedut,
  }, {
    text: 'étudiants inscrits en Licence professionnelle',
    value: (lastData?.diplomelic_pro_lic_pro1 || 0) + (lastData?.diplomelic_pro_lic_pro23 || 0),
  }, {
    text: 'étudiants inscrits en Master',
    value: (lastData?.diplomemas_m_mas_aut || 0) + (lastData?.diplomemas_m_mas_ens || 0),
  }, {
    text: 'étudiants inscrits en Master enseignement',
    value: lastData?.diplomemas_m_mas_ens,
    prefix: 'dont',
  }, {
    text: 'étudiants inscrits dans les diplôme de l\'École normale supérieure',
    value: lastData?.diplomediplnatgradem,
  }, {
    text: 'étudiants inscrits en formations d\'ingénieurs',
    value: lastData?.diplomeing,
  }, {
    text: 'étudiants inscrits dans les diplômes visés en management',
    value: (lastData?.diplomedipvisemana_manacp || 0) + (lastData?.diplomedipvisemana_manadipl || 0) + (lastData?.diplomedipvisemana_managradel || 0)
      + (lastData?.diplomedipvisemana_managradem || 0) + (lastData?.diplomedipvisemana_manassgrade || 0),
  }, {
    text: 'étudiants inscrits dans les autres diplômes visés',
    value: (lastData?.diplomedipvise_dipvisbac_3 || 0) + (lastData?.diplomedipvise_dipvisbac_5 || 0) + (lastData?.diplomedipvise_dipvisgradel || 0),
  }, {
    text: 'étudiants inscrits en formations d\'IEP',
    value: lastData?.diplomeiep,
  }, {
    text: 'étudiants inscrits en formations de comptabilité',
    value: (lastData?.diplomediplcomptable_dcg || 0) + (lastData?.diplomediplcomptable_decf || 0) + (lastData?.diplomediplcomptable_descf || 0)
      + (lastData?.diplomediplcomptable_dpecf || 0) + (lastData?.diplomediplcomptable_dscg || 0),
  }, {
    text: 'étudiants inscrits dans les diplômes canoniques',
    value: (lastData?.diplomedipcanonique_baccanonique || 0) + (lastData?.diplomedipcanonique_certtheologie || 0) + (lastData?.diplomedipcanonique_doctcanonique || 0)
      + (lastData?.diplomedipcanonique_liccanonique || 0) + (lastData?.['diplomedipcanonique_master canonique'] || 0),
  }, {
    text: 'étudiants inscrits dans les autres diplômes nationaux conférant le grade de Licence',
    value: lastData?.diplomediplnatgradel,
  }, {
    text: 'étudiants inscrits dans les autres diplômes nationaux conférant le grade de Master',
    value: lastData?.diplomediplnatgradem,
  }, {
    text: 'étudiants inscrits en PASS et PluriPASS',
    value: lastData?.diplomesante_pass,
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
    text: 'étudiants inscrits en Doctorat',
    value: lastData?.diplomedoct,
  }, {
    text: 'étudiants inscrits en HDR',
    value: lastData?.diplomehdr,
  }, {
    text: 'étudiants inscrits dans les diplômes d\'établissement',
    value: lastData?.dn_dedu,
  }, {
    text: 'étudiants inscrits dans les formations vétérinaires',
    value: lastData?.diplomeveto,
  }];

  const populationOptions = {
    ...commonOptions,
    series: [{
      name: lastData?.etablissement_lib || 'Structure sans nom',
      data: allData.map((item) => item?.effectif || 0),
    }],
    title: { text: 'Evolution des effectifs' },
  };

  const populationCycleOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits en 1er cycle',
        data: allData.map((item) => item?.cursus_lmdl || 0),
      },
      {
        name: 'Etudiants inscrits en 2ème cycle',
        data: allData.map((item) => item?.cursus_lmdm || 0),
      },
      {
        name: 'Etudiants inscrits en 3ème cycle',
        data: allData.map((item) => item?.cursus_lmdd || 0),
      },
    ],
    title: { text: 'Évolution des effectifs par cycle' },
  };

  const populationDisciplineOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits en Droit, sciences économiques, AES',
        data: allData.map((item) => item?.gd_discisciplinedsa || 0),
      },
      {
        name: 'Etudiants inscrits en Lettres, langues et sciences humaines',
        data: allData.map((item) => item?.gd_discisciplinellsh || 0),
      },
      {
        name: 'Etudiants inscrits en Théologie',
        data: allData.map((item) => item?.gd_discisciplinetheo || 0),
      },
      {
        name: 'Etudiants inscrits en Sciences et sciences de l\'ingénieur',
        data: allData.map((item) => item?.gd_discisciplinesi || 0),
      },
      {
        name: 'Etudiants inscrits en STAPS',
        data: allData.map((item) => item?.gd_discisciplinestaps || 0),
      },
      {
        name: 'Etudiants inscrits en Santé',
        data: allData.map((item) => item?.gd_discisciplinesante || 0),
      },
      {
        name: 'Etudiants inscrits en Vétérinaire',
        data: allData.map((item) => item?.gd_discisciplineveto || 0),
      },
      {
        name: 'Etudiants inscrits en Interdisciplinaire',
        data: allData.map((item) => item?.gd_discisciplineinterd || 0),
      },
    ],
    title: { text: 'Évolution des effectifs par discipline' },
  };

  const populationDiplomaOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits préparant un Bachelor universitaire de technologie',
        data: allData.map((item) => item?.diplomebut || 0),
      },
      {
        name: 'Etudiants inscrits préparant un Diplôme universitaire de technologie',
        data: allData.map((item) => item?.diplomedut || 0),
      },
      {
        name: 'Etudiants inscrits en Licence',
        data: allData.map((item) => (item?.diplomelic_l_lic_l || 0) + (item?.diplomelic_l_las || 0) + (item?.diplomelic_l_lsps || 0) + (item?.diplomelic_l_cpes || 0)),
      },
      {
        name: 'Etudiants inscrits en Master',
        data: allData.map((item) => (item?.diplomemas_m_mas_aut || 0) + (item?.diplomemas_m_mas_ens || 0)),
      },
      {
        name: 'Etudiants inscrits en formations d\'ingénieurs',
        data: allData.map((item) => item?.diplomeing || 0),
      },
      {
        name: 'Etudiants inscrits en formations d\'IEP',
        data: allData.map((item) => item?.diplomeiep || 0),
      },
      {
        name: 'Etudiants inscrits formations de comptabilité',
        data: allData.map((item) => (item?.diplomediplcomptable_dcg || 0) + (item?.diplomediplcomptable_decf || 0) + (item?.diplomediplcomptable_descf || 0)
          + (item?.diplomediplcomptable_dpecf || 0) + (item?.diplomediplcomptable_dscg || 0)),
      },
      {
        name: 'Etudiants inscrits dans les diplômes canoniques',
        data: allData.map((item) => (item?.diplomedipcanonique_baccanonique || 0) + (item?.diplomedipcanonique_certtheologie || 0) + (item?.diplomedipcanonique_doctcanonique || 0)
          + (item?.diplomedipcanonique_liccanonique || 0) + (item?.['diplomedipcanonique_master canonique'] || 0)),
      },
      {
        name: 'Etudiants inscrits dans les diplômes visés en management',
        data: allData.map((item) => (item?.diplomedipvisemana_manacp || 0) + (item?.diplomedipvisemana_manadipl || 0) + (item?.diplomedipvisemana_managradel || 0)
          + (item?.diplomedipvisemana_managradem || 0) + (item?.diplomedipvisemana_manassgrade || 0)),
      },
      {
        name: 'Etudiants inscrits dans les autres diplômes visés',
        data: allData.map((item) => (item?.diplomedipvise_dipvisbac_3 || 0) + (item?.diplomedipvise_dipvisbac_5 || 0) + (item?.diplomedipvise_dipvisgradel || 0)),
      },
      {
        name: 'Etudiants inscrits en Doctorat',
        data: allData.map((item) => item?.diplomedoct || 0),
      },
    ],
    title: { text: 'Évolution des effectifs dans les principaux diplômes' },
  };

  const populationOtherDiplomaOptions = {
    ...commonOptions,
    series: [
      {
        name: 'Etudiants inscrits préparant un diplôme d\'accès aux études universitaires',
        data: allData.map((item) => item?.diplomedaeu || 0),
      },
      {
        name: 'Etudiants inscrits en Capacité en droit',
        data: allData.map((item) => item?.diplomecapa || 0),
      },
      {
        name: 'Etudiants inscrits en Licence accès santé (dont)',
        data: allData.map((item) => item?.diplomelic_l_las || 0),
      },
      {
        name: 'Etudiants inscrits en Licence sciences pour la santé (majeure santé) (dont)',
        data: allData.map((item) => item?.diplomelic_l_lsps || 0),
      },
      {
        name: 'Etudiants inscrits en Licence professionnelle',
        data: allData.map((item) => (item?.diplomelic_pro_lic_pro1 || 0) + (item?.diplomelic_pro_lic_pro23 || 0)),
      },
      {
        name: 'Etudiants inscrits en Master enseignement (dont)',
        data: allData.map((item) => item?.diplomemas_m_mas_ens || 0),
      },
      {
        name: 'Etudiants inscrits dans les autres diplômes nationaux conférant le grade de Licence',
        data: allData.map((item) => item?.diplomediplnatgradel || 0),
      },
      {
        name: 'Etudiants inscrits dans les autres diplômes nationaux conférant le grade de Master',
        data: allData.map((item) => item?.diplomediplnatgradem || 0),
      },
      {
        name: 'Etudiants inscrits en PACES',
        data: allData.map((item) => item?.diplomesante_paces || 0),
      },
      {
        name: 'Etudiants inscrits en PASS et PluriPASS',
        data: allData.map((item) => item?.diplomesante_pass || 0),
      },
      {
        name: 'Etudiants inscrits dans les formations paramédicales',
        data: allData.map((item) => item?.diplomesante_paramedical || 0),
      },
      {
        name: 'Etudiants inscrits dans les autres formations de santé',
        data: allData.map((item) => item?.diplomesante_autres_form || 0),
      },
      {
        name: 'Etudiants inscrits en HDR',
        data: allData.map((item) => item?.diplomehdr || 0),
      },
      {
        name: 'Etudiants inscrits dans les diplômes d\'établissement',
        data: allData.map((item) => item?.dn_dedu || 0),
      },
    ],
    title: { text: 'Évolution des effectifs dans d\'autres types de diplômes' },
  };

  const rateMobilityOptions = {
    ...commonOptions,
    legend: { enabled: false },
    series: [{
      data: allData.map((item) => ((item?.mobilite_internm || 0) / item.effectif) * 100),
    }],
    title: { text: 'Évolution de la part des étudiants inscrits en mobilité internationale (en %)' },
    tooltip: {
      // eslint-disable-next-line react/no-this-in-sfc
      formatter() { return `Part de mobilité internationale : <b>${this.point.y.toFixed(1)} %</b>`; },
    },
    yAxis: { title: { text: 'Pourcentage d\'étudiants' } },
  };

  const rateNewBachelorsOptions = {
    ...commonOptions,
    series: [{
      name: 'Nouveaux bacheliers issus d\'un bac général',
      data: allData.map((item) => ((item?.nbaca || 0) / item.nouv_bachelier) * 100),
    }, {
      name: 'Nouveaux bacheliers issus d\'un bac technologique',
      data: allData.map((item) => (((item?.nouv_bachelier || 0) - ((item?.nbaca || 0) + (item?.nbac6 || 0))) / item.nouv_bachelier) * 100),
    }, {
      name: 'Nouveaux bacheliers issus d\'un bac professionnel',
      data: allData.map((item) => ((item?.nbac6 || 0) / item.nouv_bachelier) * 100),
    }],
    title: { text: 'Répartitions des nouveaux bacheliers (en %)' },
    tooltip: {
      // eslint-disable-next-line react/no-this-in-sfc
      formatter() { return `Part des ${this.series.name.toLowerCase()} en ${categories[this.point.x]} : <b>${this.point.y.toFixed(1)} %</b>`; },
    },
    yAxis: { title: { text: 'Pourcentage d\'étudiants' } },
  };

  const ageNewBachelorsOptions = {
    ...commonOptions,
    series: [{
      name: 'Nouveaux bacheliers en avance au bac d\'un an ou plus',
      data: allData.map((item) => ((item?.nbac_ageavance || 0) / item.nouv_bachelier) * 100),
    }, {
      name: 'Nouveaux bacheliers à l\'heure au bac',
      data: allData.map((item) => ((item?.nbac_agea_l_heure || 0) / item.nouv_bachelier) * 100),
    }, {
      name: 'Nouveaux bacheliers en retard au bac d\'un an ou plus',
      data: allData.map((item) => ((item?.nbac_ageretard || 0) / item.nouv_bachelier) * 100),
    }],
    title: { text: 'Âge au bac des nouveaux bacheliers (en %)' },
    tooltip: {
      // eslint-disable-next-line react/no-this-in-sfc
      formatter() { return `Part des ${this.series.name.toLowerCase()} en ${categories[this.point.x]} : <b>${this.point.y.toFixed(1)} %</b>`; },
    },
    yAxis: { title: { text: 'Pourcentage d\'étudiants' } },
  };

  const renderCards = (all) => {
    const list = all
      .filter((item) => item?.value)
      .map((item) => {
        let value = Number(item.value).toLocaleString('fr-FR');
        value = item?.prefix ? `${item.prefix} ${value}` : value;
        const total = item?.percentTotal ? item.percentTotal : lastData?.effectif;
        value = (item?.isPercent === undefined && total) ? `${value} (${cleanNumber((item.value / total) * 100)} %)` : value;
        return (
          <Card
            title={value}
            descriptionElement={(
              <Row alignItems="middle">
                <Text spacing="mr-1v mb-0">
                  {item.text}
                </Text>
              </Row>
            )}
          />
        );
      });
    return <ExpendableListCards list={list} nCol="12 md-4" max="99" />;
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  if (data.totalCount === 0) {
    return (
      <Title as="h2">
        Pas de données sur les étudiants
      </Title>
    );
  }

  return (
    <>
      <Title as="h2">
        <Icon name="ri-user-fill" className="fr-pl-1w" />
        Les étudiants inscrits
      </Title>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h3">
          {`Situation en ${year} - Source : SISE`}
        </BlocTitle>
        <BlocContent>
          {renderCards(tiles)}
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={LMDOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={disciplinesOptions}
              />
            </Col>
          </Row>
          {renderCards(tiles2)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h3">
          Évolution historique
        </BlocTitle>
        <BlocContent>
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={populationOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={populationCycleOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={populationDisciplineOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={populationDiplomaOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={populationOtherDiplomaOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={rateMobilityOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={rateNewBachelorsOptions}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={ageNewBachelorsOptions}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h3">
          Ressource(s) en ligne : #dataESR
        </BlocTitle>
        <BlocContent>
          <Row gutters>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Tableau de bord de l'enseignement supérieur : les étudiants par établissement
                  </>
                )}
                downloadUrl="https://dataesr.fr/FR/T525/P883/tableau_de_bord_de_l_enseignement_superieur_les_etudiants_par_etablissements_avec_doubles_inscriptions_cpge_-_resultats_pour_sise"
                canEdit={false}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Données agrégées en open data
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-\
etablissement/table/?refine.etablissement_id_paysage=${id}&sort=-annee_universitaire`}
                canEdit={false}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Données croisées en open data
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-sise-effectifs-d-etudiants-inscrits-esr-\
public/table/?refine.etablissement_id_paysage=${id}&sort=-annee_universitaire`}
                canEdit={false}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Liste des principaux diplômes et formations préparés en open data
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-principaux-diplomes-et-formations-prepares-etablissements-\
publics/table/?refine.etablissement_id_paysage=${id}`}
                canEdit={false}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
