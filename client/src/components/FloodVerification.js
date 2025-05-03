import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FloodVerification = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const verifyFloodRisk = async () => {
        if (!latitude || !longitude) {
            setError('Please enter both latitude and longitude');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/v1/flood/verify', {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            });

            setAssessment(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error verifying flood risk');
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
                <Alert color={riskColors[assessment.risk]}>
                    <h4 className="alert-heading">Flood Risk Assessment</h4>
                    <p>Risk Level: {assessment.risk}</p>
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
                </Alert>
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <Card>
                <CardBody>
                    <CardTitle tag="h3" className="text-center mb-4">
                        Flood Risk Verification
                    </CardTitle>
                    {error && <Alert color="danger">{error}</Alert>}
                    <Form>
                        <FormGroup>
                            <Label for="latitude">Latitude</Label>
                            <Input
                                type="text"
                                id="latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="Enter latitude"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="longitude">Longitude</Label>
                            <Input
                                type="text"
                                id="longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="Enter longitude"
                            />
                        </FormGroup>
                        <Button
                            color="primary"
                            onClick={verifyFloodRisk}
                            disabled={loading}
                        >
                            {loading ? 'Checking...' : 'Verify Flood Risk'}
                        </Button>
                    </Form>
                    {renderAssessment()}
                </CardBody>
            </Card>
        </div>
    );
};

export default FloodVerification;
