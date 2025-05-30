import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Marker = {
  lat: number;
  lng: number;
  label: string;
};

type MapWithMarkersProps = {
  markers: Marker[];
};

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ markers }) => {
  useEffect(() => {
    const map = L.map('map').setView([markers[0]?.lat || 0, markers[0]?.lng || 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markers.forEach((marker) => {
      L.marker([marker.lat, marker.lng])
        .addTo(map)
        .bindPopup(marker.label)
        .openPopup();
    });

    return () => {
      map.remove();
    };
  }, [markers]);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default MapWithMarkers;
