import React from 'react';

export const LoadingSkeleton = ({ height = '100px', width = '100%' }) => (
    <div className="skeleton" style={{ height, width, borderRadius: '4px' }}></div>
);

export const LoadingSpinner = ({ size = '16px' }) => (
    <div className="loading-spinner" style={{ width: size, height: size }}></div>
);

export const ModuleLoader = () => (
    <div className="card" style={{ padding: '1.5rem' }}>
        <LoadingSkeleton height="30px" width="200px" />
        <div style={{ marginTop: '1rem' }}>
            <LoadingSkeleton height="60px" />
        </div>
        <div style={{ marginTop: '1rem' }}>
            <LoadingSkeleton height="40px" />
        </div>
    </div>
);

export default LoadingSpinner;
