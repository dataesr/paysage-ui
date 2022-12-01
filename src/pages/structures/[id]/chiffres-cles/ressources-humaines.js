import { Col, Icon, Row, Text, Title } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HCExportingData from 'highcharts/modules/export-data';
import HCExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';

import {
  Bloc,
  BlocContent,
  BlocTitle,
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
  const { data, error, isLoading } = useFetch(`${url}/biatss?filters[rentree]=${year}&limit=999999`);

  const commonOptions = {
    legend: { enabled: false },
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
    yAxis: { title: { text: 'Effectifs' } },
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
    chart: { type: 'column' },
    tooltip: {
      // eslint-disable-next-line react/no-this-in-sfc
      formatter() { return `<b>${this.point.name} :</b> ${this.point.value} BIATSS (${cleanNumber(this.point.y)} %)`; },
    },
  };

  const effectifTotal = data?.data.reduce((accumulator, item) => accumulator + (item?.effectif || 0), 0);

  const countStaffByField = ({ fieldName, label, extraField }) => {
    let result = {};
    data?.data.forEach((item) => {
      const { [fieldName]: field, effectif } = item;
      if (!Object.keys(result).includes(field)) {
        result[field] = { staff: 0 };
        if (extraField) {
          result[field][extraField] = item?.[extraField];
        }
      }
      result[field].staff += effectif;
    });
    result = Object.keys(result).sort().reduce(
      (obj, key) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = result[key];
        return obj;
      },
      {},
    );
    return Object.keys(result).map((item) => ({
      name: label(item, result),
      value: result[item].staff,
      y: (result[item].staff / effectifTotal) * 100,
    }));
  };

  const dataCategories = countStaffByField({ fieldName: 'categorie', label: (item) => `Catégorie ${item}` });
  const dataTypes = countStaffByField({ fieldName: 'type_personnel', label: (item) => capitalize(item) });
  const dataCorps = countStaffByField({ fieldName: 'code_corps', label: (item, result) => result[item].corps_lib, extraField: 'corps_lib' });

  const renderLabs = () => data?.data.map((item) => (
    <Bloc isLoading={isLoading} error={error} data={data} noBadge>
      <BlocTitle as="h4">
        {item?.corps_lib || 'Corps non renseigné'}
        {item?.code_corps ? ` (${item.code_corps})` : ''}
      </BlocTitle>
      <BlocContent>
        <Row gutters>
          <Col n="12 md-4">
            <Card
              title="Effectif"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.effectif || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Type de personnel"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.type_personnel || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Catégorie"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.categorie || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Filière"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.filiere_lib || 'Non renseigné'}
                    {item?.code_filiere ? ` (${item.code_filiere})` : ''}
                  </Text>
                </Row>
              )}
            />
          </Col>
        </Row>
      </BlocContent>
    </Bloc>
  ));

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
                  xAxis: { categories: dataCorps.map((item) => item.name) },
                  series: [{ data: dataCorps }],
                  title: { text: 'Répartition des effectifs par corps' },
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
                  xAxis: { categories: dataCategories.map((item) => item.name) },
                  series: [{ data: dataCategories }],
                  title: { text: 'Répartition des effectifs par catégorie' },
                }}
              />
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...commonOptions,
                  xAxis: { categories: dataTypes.map((item) => item.name) },
                  series: [{ data: dataTypes }],
                  title: { text: 'Répartition des effectifs par type de personnel' },
                }}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
      {renderLabs()}
    </>
  );
}
