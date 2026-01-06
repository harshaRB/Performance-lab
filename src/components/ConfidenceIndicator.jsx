import React from 'react';
import HistoricalDataManager from '../utils/HistoricalDataManager';

const ConfidenceIndicator = ({ moduleName }) => {
    const calculateConfidence = () => {
        const history = HistoricalDataManager.getMetricHistory(moduleName, 7);

        if (history.length === 0) return { level: 'none', score: 0, color: '#EF4444' };
        if (history.length < 3) return { level: 'low', score: 33, color: '#F59E0B' };
        if (history.length < 5) return { level: 'medium', score: 66, color: '#2DD4BF' };
        return { level: 'high', score: 100, color: '#22C55E' };
    };

    const confidence = calculateConfidence();

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: `${confidence.color}22`,
            border: `1px solid ${confidence.color}`,
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)'
        }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: confidence.color
            }}></div>
            <span style={{ color: confidence.color, textTransform: 'uppercase' }}>
                {confidence.level} CONFIDENCE
            </span>
        </div>
    );
};

export default ConfidenceIndicator;
