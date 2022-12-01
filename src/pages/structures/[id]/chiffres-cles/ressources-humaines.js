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
import { Spinner } from '../../../../components/spinner';
import getOptionsFromFacet from '../../../../hooks/useChart';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';

HCExporting(Highcharts);
HCExportingData(Highcharts);

export default function StructureRHPage() {
  const year = 2020;
  const { url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/biatss?filters[rentree]=${year}&limit=999999`);
  let categories = [];
  const dataCategoriesTmp = {};
  data?.data.forEach((item) => {
    const { categorie, effectif } = item;
    if (!categories.includes(categorie)) {
      categories.push(categorie);
      dataCategoriesTmp[categorie] = 0;
    }
    dataCategoriesTmp[categorie] += effectif;
  });
  categories = categories.sort().map((item) => `Catégorie ${item}`);
  const tmp = Object.keys(dataCategoriesTmp).sort();
  const dataCategories = tmp.map((item) => ({ name: `Catégorie ${item}`, y: dataCategoriesTmp[item] }));
  const effectif = data?.data.reduce((accumulator, item) => accumulator + (item?.effectif || 0), 0);

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
                      {effectif || 'Non renseigné'}
                    </Text>
                  </Row>
                )}
              />
            </Col>
            <Col className="print-12" n="12 md-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={getOptionsFromFacet({
                  data: data?.data || [],
                  facet: 'code_corps',
                  label: 'corps_lib',
                  serieName: 'Effectif',
                  title: 'Corps',
                })}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
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
                  xAxis: { categories },
                  yAxis: { title: { text: 'Effectif' } },
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
                  series: [{ data: dataCategories }],
                  title: { text: 'Répartition des effectifs par catégorie' },
                }}
              />
              {/* <HighchartsReact
                highcharts={Highcharts}
                options={getOptionsFromFacet({
                  data: [{ categorie: 'A', y: 12 }, {  }] || [],
                  facet: 'categorie',
                  label: 'categorie',
                  serieName: 'Effectif',
                  title: 'Catégories',
                })}
              /> */}
            </Col>
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={getOptionsFromFacet({
                  data: data?.data || [],
                  facet: 'type_personnel',
                  label: 'type_personnel',
                  serieName: 'Effectif',
                  title: 'Types de personnel',
                })}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
      {renderLabs()}
    </>
  );
}
