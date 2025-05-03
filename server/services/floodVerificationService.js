const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const ELEVATION_API = 'https://api.opentopodata.org/v1/aster?locations=';
const WEATHER_API = 'https://api.weather.gov/points/';
const HISTORICAL_FLOOD_API = 'https://api.weather.gov/stations/';

async function getElevation(lat, lng) {
    try {
        const response = await axios.get(`${ELEVATION_API}${lat},${lng}`);
        if (response.data && response.data.results && response.data.results[0]) {
            return response.data.results[0].elevation;
        }
        console.error('No elevation data found for coordinates:', { lat, lng });
        return null;
    } catch (error) {
        console.error('Error fetching elevation:', error);
        return null;
    }
}

async function getWeatherAlerts(lat, lng) {
    try {
        const response = await axios.get(`${WEATHER_API}${lat},${lng}`);
        if (response.data && response.data.properties && response.data.properties.forecast) {
            const forecastResponse = await axios.get(response.data.properties.forecast);
            if (forecastResponse.data && forecastResponse.data.properties && forecastResponse.data.properties.periods) {
                return forecastResponse.data.properties.periods;
            }
        }
        console.error('No weather data found for coordinates:', { lat, lng });
        return [];
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return [];
    }
}

async function getHistoricalFloodData(lat, lng) {
    try {
        // Get nearest weather station
        const response = await axios.get(`${WEATHER_API}${lat},${lng}`);
        const stationId = response.data.properties?.station;
        
        if (!stationId) {
            console.error('No weather station found for coordinates:', { lat, lng });
            return {
                recentFloods: 0,
                lastFlood: null
            };
        }

        // Get historical flood data
        const historicalResponse = await axios.get(`${HISTORICAL_FLOOD_API}${stationId}/observations`);
        
        // Filter for flood-related observations
        const floodObservations = historicalResponse.data.features
            .filter(obs => obs.properties?.textDescription?.toLowerCase().includes('flood'));
            
        return {
            recentFloods: floodObservations.length,
            lastFlood: floodObservations[0]?.properties?.timestamp
        };
    } catch (error) {
        console.error('Error fetching historical flood data:', error);
        return {
            recentFloods: 0,
            lastFlood: null
        };
    }
}

async function getSoilMoisture(lat, lng) {
    try {
        // Using a placeholder API - replace with actual NASA SMAP API in production
        return Math.random() * 1.0; // Return a random moisture value between 0 and 1
    } catch (error) {
        console.error('Error fetching soil moisture:', error);
        return 0;
    }
}

async function getRiverLevels(lat, lng) {
    try {
        // Using a placeholder API - replace with actual USGS API in production
        return Math.random() * 10; // Return a random river level between 0 and 10
    } catch (error) {
        console.error('Error fetching river levels:', error);
        return 0;
    }
}

async function assessFloodRisk(lat, lng) {
    const elevation = await getElevation(lat, lng);
    const weatherAlerts = await getWeatherAlerts(lat, lng);
    const historicalData = await getHistoricalFloodData(lat, lng);
    const soilMoisture = await getSoilMoisture(lat, lng);
    const riverLevel = await getRiverLevels(lat, lng);

    if (!elevation || !weatherAlerts) {
        console.error('Insufficient data for flood assessment:', {
            elevation: elevation === null,
            weatherAlerts: weatherAlerts.length === 0,
            historicalData: historicalData.recentFloods === 0,
            soilMoisture: soilMoisture === null,
            riverLevel: riverLevel === null
        });
        
        return {
            risk: 'LOW',
            riskScore: 0,
            details: ['Insufficient data for accurate assessment'],
            elevation: elevation || 0,
            historicalData: historicalData || { recentFloods: 0, lastFlood: null },
            soilMoisture: soilMoisture || 0,
            riverLevel: riverLevel || 0
        };
    }

    let riskLevel = 'LOW';
    let details = [];
    let riskScore = 0;

    // Check for heavy rainfall in the next 24 hours
    const upcomingRain = weatherAlerts.find(period => 
        period?.shortForecast?.includes('Rain') && 
        period?.probabilityOfPrecipitation?.value > 50
    );

    if (upcomingRain) {
        riskScore += 50;
        details.push('Heavy rainfall expected in the next 24 hours');
        riskLevel = riskLevel === 'LOW' ? 'MODERATE' : riskLevel;
    }

    // Check historical flood data
    if (historicalData?.recentFloods > 0) {
        riskScore += historicalData.recentFloods * 10;
        details.push(`Recent floods: ${historicalData.recentFloods}`);
        if (historicalData.recentFloods > 2) {
            riskLevel = 'HIGH';
        } else if (historicalData.recentFloods > 0) {
            riskLevel = 'MODERATE';
        }
    }

    // Check soil moisture
    if (soilMoisture && soilMoisture > 0.3) {
        riskScore += 20;
        details.push('High soil moisture detected');
        riskLevel = riskLevel === 'LOW' ? 'MODERATE' : riskLevel;
    }

    // Check river levels
    if (riverLevel && riverLevel > 5) {
        riskScore += 40;
        details.push('High river levels detected');
        riskLevel = 'HIGH';
    }

    // Determine final risk level based on score
    if (riskScore >= 75) {
        riskLevel = 'HIGH';
    } else if (riskScore >= 50) {
        riskLevel = 'MODERATE';
    }

    return {
        risk: riskLevel,
        riskScore: riskScore,
        details: details,
        elevation: elevation,
        historicalData: historicalData,
        soilMoisture: soilMoisture,
        riverLevel: riverLevel
    };
}

module.exports = {
    assessFloodRisk
};
