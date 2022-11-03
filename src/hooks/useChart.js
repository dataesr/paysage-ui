export default function getOptionsFromFacet({ colors, data, facet, serieName, title, label = false }) {
  const dataObject = {};
  data?.forEach((item) => {
    if (!dataObject?.[item?.[facet]]) {
      dataObject[item?.[facet]] = { y: 0, label: `${item?.[label] || item?.[facet]}` };
    }
    dataObject[item?.[facet]].y += 1;
  });

  const dataArray = [];
  Object.keys(dataObject).sort().forEach((item) => dataArray.push(dataObject[item]));
  dataArray.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.label = (item.label === 'undefined') ? 'Non renseigné' : item.label;
    return item;
  });

  const categories = dataArray.map((item) => item?.label || undefined);

  const options = {
    chart: { type: 'column' },
    credits: { enabled: false },
    legend: { enabled: false },
    lang: { downloadJPEG: 'Téléchagez en JPEG', downloadPNG: 'Téléchargez en PNG', downloadPDF: 'Téléchargez en PDF', downloadSVG: 'Téléchargez en SVG', downloadCSV: 'Téléchargez en CSV', downloadXLS: 'Téléchargez en XLS', viewFullscreen: 'Plein écran', printChart: 'Imprimer le graphique' },
    series: [{
      name: serieName,
      data: dataArray,
    }],
    title: { text: title },
    xAxis: { categories },
    yAxis: { title: { text: serieName } },
    exporting: { buttons: { contextButton: { menuItems: ['viewFullscreen', 'printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator', 'downloadCSV', 'downloadXLS', 'openInCloud'] } } },
  };

  if (colors) {
    const colorsArray = categories.map((item) => colors?.[item] || '#D7D7D7');
    options.colors = colorsArray;
    options.plotOptions = { column: { colorByPoint: true } };
  }

  return options;
}
