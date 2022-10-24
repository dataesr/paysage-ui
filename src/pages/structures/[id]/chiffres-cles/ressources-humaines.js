import { Col, Icon, Row, Text, Title } from '@dataesr/react-dsfr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';

export default function StructureRHPage() {
  const year = 2020;
  const { url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/biatss?filters[rentree]=${year}`);
  const effectif = data?.data.reduce((accumulator, item) => accumulator + (item?.effectif || 0), 0);
  const commonOptions = {
    credits: { enabled: false },
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
      series: [{ data: sobrietyData, name: 'Nombre de bâtiments' }],
      title: { text },
    };
  };

  const renderLabs = () => data?.data.map((item) => (
    <Bloc isLoading={isLoading} error={error} data={data} noBadge>
      <BlocTitle as="h4">
        {item?.etablissement_compos_lib || 'Nom non renseigné'}
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
              title="Corps"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.corps_lib || 'Non renseigné'}
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
              title="Type d'établissement"
              descriptionElement={(
                <Row alignItems="middle">
                  <Text spacing="mr-1v mb-0">
                    {item?.etablissement_type || 'Non renseigné'}
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
                    {item?.code_filiere || 'Non renseigné'}
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
        {`Ressources humaines pour l'année ${year}`}
      </Title>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Effectif
        </BlocTitle>
        <BlocContent>
          <Row gutters>
            <Col n="12 md-4">
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
            <Col className="print-12" n="12 md-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={getOptionsFromFacet({
                  facet: 'code_corps',
                  text: 'Corps',
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
