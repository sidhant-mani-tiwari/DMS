const mongoose = require('mongoose');

const floodRiskSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    elevation: {
        type: Number,
        required: true
    },
    floodRisk: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH'],
        required: true
    },
    riskScore: {
        type: Number,
        required: true
    },
    details: [{
        type: String
    }],
    historicalData: {
        recentFloods: {
            type: Number,
            default: 0
        },
        lastFlood: {
            type: Date
        }
    },
    soilMoisture: {
        type: Number
    },
    riverLevel: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

floodRiskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FloodRisk', floodRiskSchema);
