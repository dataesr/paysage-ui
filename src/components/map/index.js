import { Icon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

export default function Map({ height, lat, lng, markers, width, zoom }) {
  const defaultCenter = [lat, lng];

  const getIcon = (color = 'blue') => {
    let iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
    if (color === 'red') {
      iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    }
    const LeafIcon = Icon.extend({
      options: {},
    });
    return new LeafIcon({
      iconUrl,
      iconSize: [50, 82],
      iconAnchor: [25, 82],
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    });
  };

  // Calculate bounds
  function ChangeView({ allMarkers }) {
    const map = useMap();
    const markerBounds = latLngBounds([]);
    if (allMarkers.length && allMarkers.length > 0) {
      allMarkers.map((marker) => markerBounds.extend(marker.latLng));
      if (markerBounds.isValid()) map.fitBounds(markerBounds);
    }
  }

  return (
    <MapContainer
      attributionControl
      center={defaultCenter}
      scrollWheelZoom={false}
      style={{ height, width }}
      zoom={zoom}
    >
      <ChangeView allMarkers={markers} />
      <TileLayer
        attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
        url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8"
      />
      {markers.map((marker) => (
        <Marker position={marker.latLng} key={marker.latLng} icon={getIcon(marker?.color)}>
          <Popup>
            {marker.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

Map.defaultProps = {
  height: '300px',
  lat: 0,
  lng: 0,
  markers: [{ address: 'Paris centre', color: 'blue', latLng: [48.866667, 2.333333] }],
  width: '100%',
  zoom: 12,
};

Map.propTypes = {
  height: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  markers: PropTypes.array,
  width: PropTypes.string,
  zoom: PropTypes.number,
};
