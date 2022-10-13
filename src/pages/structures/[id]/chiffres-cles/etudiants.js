import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useHashScroll from '../../../../hooks/useHashScroll';
import useUrl from '../../../../hooks/useUrl';

export default function StructureEtudiantsPage() {
  useHashScroll();
  const { url } = useUrl('keynumbers');
  const { data, isLoading, error } = useFetch(`${url}/population`);
  const sortedData = data?.data.sort((a, b) => a.annee - b.annee) || [];
  const population = sortedData.map((item) => item?.effectif || 0);
  const name = sortedData?.[0]?.etablissement_lib || 'Structure sans nom';
  const categories = sortedData.map((item) => item.annee);

  const options = {
    title: {
      text: 'Evolution des effectifs',
    },
    xAxis: {
      categories,
    },
    series: [{ name, data: population }],
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}
