import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';

const getIcon = (color = '#0078f3') => divIcon({
  html: `
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="30">
      <path fill="none" d="M0 0h24v24H0z"/>
      <g fill=${color} stroke=#000 stroke-width="1" fill-opacity="0.5">
        <path d="M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0"/>
        <circle cx="12" cy="13" r="1"/>
      </g>
    </svg>
  `,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function SetMap({ markers }) {
  const map = useMap();
  if (markers.length) {
    const markerBounds = markers && latLngBounds(markers.map((m) => m.latLng));
    map.fitBounds(markerBounds, { padding: [50, 50] });
  }
  if (map.getZoom() > 12) map.setZoom(12);
  return null;
}
SetMap.defaultProps = {
  markers: [],
};

SetMap.propTypes = {
  markers: PropTypes.array,
};

export default function Map({ height, markers, onMarkerDragEnd, width }) {
  const eventHandlers = useMemo(() => ({ dragend(e) { return onMarkerDragEnd(e); } }), [onMarkerDragEnd]);
  const theme = (window.localStorage.getItem('prefers-color-scheme') === 'dark')
    ? 'dark'
    : 'sunny';
  return (
    <MapContainer
      attributionControl
      center={[48.866667, 2.333333]}
      scrollWheelZoom={false}
      style={{ height, width }}
      zoom={6}
    >
      <TileLayer
        attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
        url={`https://tile.jawg.io/jawg-${theme}/{z}/{x}/{y}.png?access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8`}
      />
      {markers.map((marker, i) => (
        <Marker zIndexOffset={marker?.zIndexOffset || 10000} icon={getIcon(marker.color)} draggable={!!onMarkerDragEnd} eventHandlers={eventHandlers} key={i} position={marker.latLng}>
          <Tooltip>
            {marker?.label && (
              <strong>
                {marker.label}
                <br />
              </strong>
            )}
            <i>
              {marker?.address?.startsWith('{,') ? null : marker?.address?.replace(/{|}/g, '')}
            </i>

          </Tooltip>
        </Marker>
      ))}
      <SetMap markers={markers} />
    </MapContainer>
  );
}

Map.defaultProps = {
  height: '300px',
  markers: [],
  onMarkerDragEnd: null,
  width: '100%',
};

Map.propTypes = {
  height: PropTypes.string,
  markers: PropTypes.array,
  onMarkerDragEnd: PropTypes.func,
  width: PropTypes.string,
};
