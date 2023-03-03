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
import Map from '../../../../components/map';
import { Spinner } from '../../../../components/spinner';
import getOptionsFromFacet from '../../../../hooks/useChart';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';

import './immobilier.scss';

HCExporting(Highcharts);
HCExportingData(Highcharts);

export default function StructureImmobilierPage() {
  const { url: urlLocalisations } = useUrl('localisations');
  const { data: dataLocalisations } = useFetch(urlLocalisations);
  const currentLocalisation = dataLocalisations?.data?.[0];
  const { url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/real-estate?sort=-annee&limit=999`);
  const lastYear = data?.data?.[0]?.annee;
  const allData = data?.data?.filter((item) => item?.annee === lastYear) || [];

  const markers = [];
  if (currentLocalisation?.coordinates?.lat && currentLocalisation?.coordinates?.lng) {
    markers.push({
      address: `${currentLocalisation?.address} ${currentLocalisation?.postalCode} ${currentLocalisation?.locality}`,
      label: allData?.[0]?.etablissement,
      latLng: [
        currentLocalisation?.coordinates?.lat,
        currentLocalisation?.coordinates?.lng,
      ],
      color: '#990000',
      zIndexOffset: 10099,
    });
  }
  allData?.filter((item) => item?.latlong)?.forEach((item) => {
    markers.push({
      address: `${item?.adresse} ${item?.cp} ${item?.com_nom}`,
      label: item?.libelle_bat_ter,
      latLng: item?.latlong,
    });
  });

  const energyColors = {
    A: '#34B659',
    B: '#51BF4C',
    C: '#A7D934',
    D: '#EDEE25',
    E: '#F9AE1D',
    F: '#F36326',
    G: '#EE2332',
  };

  const energyThreshold = {
    undefined: '',
    A: '< 50',
    B: '51 à 90',
    C: '91 à 150',
    D: '151 à 230',
    E: '231 à 330',
    F: '331 à 450',
    G: '> 450',
  };

  const renderBuildings = () => allData.map((item) => (
    <Bloc isLoading={isLoading} error={error} data={data} noBadge>
      <BlocTitle as="h4">
        {item?.libelle_bat_ter || 'Nom non renseigné'}
      </BlocTitle>
      <BlocContent>
        <Row gutters>
          <Col n="12 md-4">
            <Card
              title="Adresse"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.adresse}
                    {' '}
                    {item?.cp}
                    {' '}
                    {item?.com_nom}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Accessibilité"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.access_adap || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Consommation d'énergie"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.energie_valeur || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Classe d'énergie"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0" className={`ges ges-${item?.energie_class?.toLowerCase()}`}>
                    <div className="letter">
                      <div className="line">
                        <em>
                          {energyThreshold?.[item?.energie_class]}
                        </em>
                        <strong>
                          {item?.energie_class || 'Non renseigné'}
                        </strong>
                      </div>
                      <div className="sticker">
                        {item?.energie_class || 'Non renseigné'}
                      </div>
                    </div>
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="GES"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.ges || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Catégorie d'ERP"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.categorie_erp || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Type d'ERP"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.type_erp || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Existance d'un bilan carbone"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.bilan_carbone || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Date du bilan carbone"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.bilan_carbone_date || 'Non renseigné'}
                  </Text>
                </Row>
              )}
            />
          </Col>
          <Col n="12 md-4">
            <Card
              title="Etat santé"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.etat_sante || 'Non renseigné'}
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
      {!allData?.length && (
        <Title as="h3">
          Pas de données immobilières connues pour cette structure
        </Title>
      )}
      {!!allData?.length && (
        <>
          <Title as="h3">
            <Icon name="ri-community-fill" className="fr-pl-1w" />
            {`Immobilier en ${lastYear}`}
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
                    options={getOptionsFromFacet({
                      colors: energyColors,
                      data: allData,
                      facet: 'energie_class',
                      serieName: 'Nombre de bâtiments',
                      title: 'Répartition des classes d\'énergie des bâtiments',
                    })}
                  />
                </Col>
                <Col className="print-12" n="12 md-6">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={getOptionsFromFacet({
                      colors: energyColors,
                      data: allData,
                      facet: 'ges',
                      serieName: 'Nombre de bâtiments',
                      title: 'Répartition des gaz à effet de serre des bâtiments',
                    })}
                  />
                </Col>
                <Col className="print-12" n="12 md-6">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={getOptionsFromFacet({
                      data: allData,
                      facet: 'categorie_erp',
                      serieName: 'Nombre de bâtiments',
                      title: 'Répartition des catégories d\'établissement recevant du public',
                    })}
                  />
                </Col>
                <Col className="print-12" n="12 md-6">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={getOptionsFromFacet({
                      data: allData,
                      facet: 'type_erp',
                      serieName: 'Nombre de bâtiments',
                      title: 'Répartition des types d\'établissement recevant du public',
                    })}
                  />
                </Col>
                <Col className="print-12" n="12 md-6">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={getOptionsFromFacet({
                      data: allData,
                      facet: 'bilan_carbone',
                      serieName: 'Nombre de bâtiments',
                      title: 'Existence d\'un bilan carbone des bâtiments',
                    })}
                  />
                </Col>
              </Row>
            </BlocContent>
          </Bloc>
          <Bloc isLoading={isLoading} error={error} data={data} noBadge>
            <BlocTitle as="h4">
              Géographie
            </BlocTitle>
            <BlocContent>
              <Map
                lat={currentLocalisation?.coordinates?.lat}
                lng={currentLocalisation?.coordinates?.lng}
                markers={markers}
              />
            </BlocContent>
          </Bloc>
          {renderBuildings()}
        </>
      )}
    </>
  );
}
