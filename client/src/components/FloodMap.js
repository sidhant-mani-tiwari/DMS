import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapEvents from './MapEvents';

const FloodMap = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { token } = useAuth();

    const verifyFloodRisk = async () => {
        if (!selectedLocation) {
            setError('Please select a location on the map');
            return;
        }

        if (!token) {
            setError('Please login to verify flood risk');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/flood/verify',
                {
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setAssessment(response.data);
        } catch (err) {
            console.error('Flood verification error:', err);
            setError(err.response?.data?.error || 'Error verifying flood risk. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderAssessment = () => {
        if (!assessment) return null;

        const riskColors = {
            LOW: 'success',
            MODERATE: 'warning',
            HIGH: 'danger'
        };

        return (
            <div className="mt-4">
                <div className={`alert alert-${riskColors[assessment.floodRisk]}`}>
                    <h4 className="alert-heading">Flood Risk Assessment</h4>
                    <p>Risk Level: {assessment.risk}</p>
                    <p>Risk Score: {assessment.riskScore}</p>
                    {assessment.details && assessment.details.length > 0 && (
                        <div>
                            <h5>Details:</h5>
                            <ul>
                                {assessment.details.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p>Elevation: {assessment.elevation} meters</p>
                    {assessment.historicalData?.recentFloods > 0 && (
                        <p>Recent Floods: {assessment.historicalData.recentFloods}</p>
                    )}
                    {assessment.soilMoisture !== undefined && (
                        <p>Soil Moisture: {assessment.soilMoisture.toFixed(2)}</p>
                    )}
                    {assessment.riverLevel !== undefined && (
                        <p>River Level: {assessment.riverLevel} ft</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h3 className="text-center mb-4">Flood Risk Verification Map</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <MapContainer 
                        center={[20.5937, 78.9629]} 
                        zoom={5} 
                        style={{ height: '500px', width: '100%' }}
                        className="mb-4"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapEvents onLocationSelect={setSelectedLocation} />
                    </MapContainer>
                    <button
                        className={`btn ${!selectedLocation || loading ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={verifyFloodRisk}
                        disabled={!selectedLocation || loading}
                    >
                        {loading ? 'Checking...' : 'Verify Flood Risk'}
                    </button>
                    {renderAssessment()}
                </div>
            </div>
        </div>
    );
};

export { FloodMap };
