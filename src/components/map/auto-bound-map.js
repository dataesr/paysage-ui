import { useMemo } from 'react';
import PropTypes from 'prop-types';
import L, { latLngBounds } from 'leaflet';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';

function SetMap({ markers }) {
  const map = useMap();
  if (markers.length) {
    const markerBounds = markers && latLngBounds(markers.map((m) => m.latLng));
    map.fitBounds(markerBounds, { padding: [50, 50] });
  }
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl:
      'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  });
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
      {markers.map((marker) => (
        <Marker draggable={!!onMarkerDragEnd} eventHandlers={eventHandlers} key={marker.latLng} position={marker.latLng}>
          <Tooltip>
            {marker?.label && (
              <>
                {marker.label}
                <br />
              </>
            )}
            {marker.address}
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
