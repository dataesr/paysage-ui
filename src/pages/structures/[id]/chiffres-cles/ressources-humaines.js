/* eslint-disable react/no-this-in-sfc */
import { Col, Icon, Row, Text, Title } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';

import {
  Bloc,
  BlocContent,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import { Spinner } from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import cleanNumber from '../../../../utils/clean-numbers';
import { capitalize } from '../../../../utils/strings';

HCExporting(Highcharts);
HCExportingData(Highcharts);

export default function StructureRHPage() {
  const year = 2020;
  const { url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/biatss?filters[rentree]=${year}&limit=0`);

  const commonOptions = {
    chart: { type: 'column' },
    colors: ['#fa96f2', '#adadf9'],
    credits: { enabled: false },
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
    legend: { reversed: true },
    plotOptions: { column: { dataLabels: { enabled: true }, stacking: 'normal' } },
    tooltip: {
      formatter() { return `<b>${this.x} - ${this.series.name} :</b> ${this.point.y} BIATSS (${cleanNumber((this.point.y / this.point.stackTotal) * 100)} %)`; },
    },
    yAxis: { title: { text: 'Effectifs' }, stackLabels: { enabled: true } },
  };

  const effectifTotal = data?.data.reduce((accumulator, item) => accumulator + (item?.effectif || 0), 0);

  const countStaffByFieldAndGender = ({ fieldName, label, extraField, filter = (item) => item }) => {
    let result = {};
    data?.data.filter(filter).forEach((item) => {
      const { [fieldName]: field } = item;
      if (!Object.keys(result).includes(field)) {
        result[field] = { women: 0, men: 0 };
        if (extraField) {
          result[field][extraField] = item?.[extraField];
        }
      }
      result[field].women += item?.effectif_femmes || 0;
      result[field].men += item?.effectif_hommes || 0;
    });
    result = Object.keys(result).sort().reduce(
      (obj, key) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = result[key];
        return obj;
      },
      {},
    );
    const categories = Object.keys(result).map((item) => label(item, result));
    const women = Object.keys(result).map((item) => result[item]?.women || 0);
    const men = Object.keys(result).map((item) => result[item]?.men || 0);
    const series = [{ name: 'Femmes', data: women }, { name: 'Hommes', data: men }];
    return { categories, series };
  };

  const { categories: categoriesCategorie, series: seriesCategorie } = countStaffByFieldAndGender({ fieldName: 'categorie', label: (item) => `Catégorie ${item}` });
  const { categories: categoriesCorps, series: seriesCorps } = countStaffByFieldAndGender({ fieldName: 'code_corps', label: (item, result) => result[item].corps_lib, extraField: 'corps_lib' });
  const { categories: categoriesFiliere, series: seriesFiliere } = countStaffByFieldAndGender({ fieldName: 'code_filiere', label: (item, result) => result[item].filiere_lib, extraField: 'filiere_lib' });
  const { categories: categoriesTypePersonnel, series: seriesTypePersonnel } = countStaffByFieldAndGender({ fieldName: 'type_personnel', label: (item) => capitalize(item) });
  const { categories: categoriesBap, series: seriesBap } = countStaffByFieldAndGender({ fieldName: 'code_bap', label: (item, result) => result[item].bap_lib, extraField: 'bap_lib', filter: (item) => item?.code_bap && item?.bap_lib && item.code_filiere === 'ITRF' });
  const { categories: categoriesAge, series: seriesAge } = countStaffByFieldAndGender({ fieldName: 'classe_age3', label: (item) => item, filter: (item) => item?.classe_age3 });
  seriesAge[1].data = seriesAge[1].data.map((item) => -item);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Title as="h3">
        <Icon name="ri-community-fill" className="fr-pl-1w" />
        {`Ressources humaines BIATSS pour l'année ${year}`}
      </Title>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocContent>
          <Row gutters>
            <Col className="print-12" n="12 md-4">
              <Card
                title="Effectif"
                descriptionElement={(
                  <Row alignItems="middle">
                    <Text spacing="mr-1v mb-0">
                      {effectifTotal || 'Non renseigné'}
                    </Text>
                  </Row>
                )}
              />
            </Col>
            <Col className="print-12" n="12 md-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  series: seriesCorps,
                  title: { text: 'Répartition des effectifs par corps et par genre' },
                  xAxis: { categories: categoriesCorps },
                }}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  series: seriesCategorie,
                  title: { text: 'Répartition des effectifs par catégorie et par genre' },
                  xAxis: { categories: categoriesCategorie },
                }}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  series: seriesTypePersonnel,
                  title: { text: 'Répartition des effectifs par type de personnel et par genre' },
                  xAxis: { categories: categoriesTypePersonnel },
                }}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  series: seriesFiliere,
                  title: { text: 'Répartition des effectifs par filière et par genre' },
                  xAxis: { categories: categoriesFiliere },
                }}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  series: seriesBap,
                  title: { text: 'Répartition des effectifs par BAP et par genre pour les ITRF' },
                  xAxis: { categories: categoriesBap },
                }}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  chart: { type: 'bar' },
                  plotOptions: { series: { stacking: 'normal', dataLabels: { enabled: true, formatter() { return Math.abs(this.y); } } } },
                  series: seriesAge,
                  title: { text: 'Répartition des effectifs par âge et par genre' },
                  tooltip: {
                    formatter() { return `<b>${this.x} - ${this.series.name} :</b> ${Math.abs(this.point.y)} BIATSS`; },
                  },
                  xAxis: [{ categories: categoriesAge, reversed: false }, { categories: categoriesAge, reversed: false, opposite: true, linkedTo: 0 }],
                  yAxis: { title: { text: 'Effectifs' }, labels: { formatter() { return Math.abs(this.value); } } },
                }}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
