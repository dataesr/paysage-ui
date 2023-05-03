import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import PropTypes from 'prop-types';

const series = [{
  name: 'Succès',
  id: 'success',
  color: 'var(--jobs-success-color)',
  marker: {
    symbol: 'circle',
  },
},
{
  name: 'Echec',
  color: 'var(--jobs-failed-color)',
  id: 'failed',
  marker: {
    symbol: 'circle',
  },
},
{
  name: 'En cours',
  color: 'var(--jobs-running-color)',
  id: 'running',
  marker: {
    symbol: 'circle',
  },
},
{
  name: 'Prévue',
  color: 'var(--jobs-scheduled-color)',
  id: 'scheduled',
  marker: {
    symbol: 'circle',
  },
}];

const options = {
  chart: {
    type: 'scatter',
    zoomType: 'xy',
  },
  global: {
    useUTC: false,
  },
  title: {
    text: undefined,
  },
  tooltip: {
    formatter() {
      return `
        Tâche: <b>${this.point.name}</b><br/>
        Status: <b>${this.series.name.toUpperCase()}</b><br />
        `;
      // le ${Highcharts.dateFormat('%d-%m-%Y %H:%M', this.x)}
    },
  },
  exporting: { enabled: false },
  credits: { enabled: false },
  xAxis: {
    title: {
      text: undefined,
    },
    type: 'datetime',
    // labels: {
    //   formatter() {
    //     return Highcharts.dateFormat('%a %e %b', this.value);
    //   },
    // },
    // tickInterval: 24 * 3600 * 1000,
  },
  yAxis: {
    title: {
      text: undefined,
    },
    type: 'datetime',
    labels: { format: '{value}s' },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
            lineColor: 'rgb(100,100,100)',
          },
        },
      },
      states: {
        hover: {
          marker: {
            enabled: false,
          },
        },
      },
    },
  },
};

export default function ScatterPlot({ data }) {
  if (!data?.length) return null;
  const fillfulledSeries = series.map((s) => {
    const temp = data.map((elm) => {
      if (elm.status !== s.id) return null;
      return { x: elm.date, y: elm.duration, name: elm.name };
    }).filter((elm) => elm);
    return { ...s, data: temp };
  });
  options.series = fillfulledSeries;
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: '200px', width: '100%' } }}
    />
  );
}

ScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
};
