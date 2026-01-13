// src/components/MapPicker.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // ✅ Only update lat/lon (no API call here)
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const MapViewUpdater = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lon) {
      const newCenter = [parseFloat(lat), parseFloat(lon)];
      map.setView(newCenter, 13, { animate: true }); // zoom in to level 13
    }
  }, [lat, lon, map]);

  return null;
};

const MapPicker = ({ lat, lon, onLocationSelect }) => {
  const [position, setPosition] = useState(
    lat && lon ? [parseFloat(lat), parseFloat(lon)] : [20.5937, 78.9629]
  );

  useEffect(() => {
    if (lat && lon) {
      setPosition([parseFloat(lat), parseFloat(lon)]);
    }
  }, [lat, lon]);

  return (
    <MapContainer
      center={position}
      zoom={lat && lon ? 13 : 5}
      style={{ height: "100%", width: "100%", borderRadius: 10 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapViewUpdater lat={lat} lon={lon} />
      
      <LocationMarker
        position={position}
        onSelect={(lat, lon) => {
          setPosition([lat, lon]);
          onLocationSelect(lat, lon);
        }}
      />
    </MapContainer>
  );
};

export default MapPicker;
