import React, { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const MapEvents = ({ onLocationSelect }) => {
    const map = useMapEvents({
        click(e) {
            onLocationSelect({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });

            // Remove previous marker if exists
            const existingMarker = document.querySelector('.custom-marker');
            if (existingMarker) {
                existingMarker.remove();
            }

            // Create custom marker icon
            const customIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
                shadowSize: [41, 41]
            });

            // Add new marker
            const marker = L.marker([e.latlng.lat, e.latlng.lng], {
                icon: customIcon
            }).addTo(map);
            marker._icon.className += ' custom-marker';
        }
    });

    return null;
};

export default MapEvents;
