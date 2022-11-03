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
