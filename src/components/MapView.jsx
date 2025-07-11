import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Konfigurasi marker manual agar tidak 404
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});


const MapView = ({ coord, name }) => {
  if (!coord) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">🗺️ Peta Lokasi: {name}</h3>
      <MapContainer
        center={[coord.lat, coord.lon]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '100%', borderRadius: '1rem' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coord.lat, coord.lon]}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;