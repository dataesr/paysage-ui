import { useMemo } from 'react';
import PropTypes from 'prop-types';
import L, { latLngBounds } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';

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
  return null;
}
SetMap.defaultProps = {
  markers: [],
};

SetMap.propTypes = {
  markers: PropTypes.array,
};

export default function Map({ markers, height, width, onMarkerDragEnd }) {
  const eventHandlers = useMemo(() => ({ dragend(e) { return onMarkerDragEnd(e); } }), [onMarkerDragEnd]);
  return (
    <MapContainer
      center={[48.866667, 2.333333]}
      zoom={6}
      // maxZoom={18}
      style={{ width, height }}
      scrollWheelZoom={false}
      attributionControl
    >
      <TileLayer
        attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
        url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8"
      />
      {markers.map((marker) => (
        <Marker position={marker.latLng} key={marker.latLng} draggable={!!onMarkerDragEnd} eventHandlers={eventHandlers}>
          <Popup>{marker.address}</Popup>
        </Marker>
      ))}
      <SetMap markers={markers} />
    </MapContainer>
  );
}

Map.defaultProps = {
  markers: [],
  height: '300px',
  width: '100%',
  onMarkerDragEnd: null,
};

Map.propTypes = {
  markers: PropTypes.array,
  height: PropTypes.string,
  width: PropTypes.string,
  onMarkerDragEnd: PropTypes.func,
};
