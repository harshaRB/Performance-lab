
// Performance Lab - Calculations Worker
// Handles heavy statistical math off the main thread.

self.onmessage = (e) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'CALCULATE_CORRELATIONS':
            const correlations = calculateCorrelations(payload);
            self.postMessage({ type: 'CORRELATIONS_RESULT', payload: correlations });
            break;

        case 'PREDICT_TREND':
            const trend = calculateTrend(payload);
            self.postMessage({ type: 'TREND_RESULT', payload: trend });
            break;

        default:
            console.warn('Worker received unknown message type:', type);
    }
};

// Helper: Calculate Pearson Correlation Coefficient
// Payload: Array of objects { date, sleep, training, nutrition, cognitive }
function calculateCorrelations(data) {
    if (!data || data.length < 5) return []; // Need valid sample size

    const keys = ['sleep', 'training', 'nutrition', 'learning', 'screen'];
    const matrix = [];

    // Extract vectors
    const vectors = {};
    keys.forEach(k => vectors[k] = data.map(d => d[k] || 0));

    // Compute pairwise correlations
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            if (i === j) continue;

            const keyA = keys[i];
            const keyB = keys[j];
            const r = pearson(vectors[keyA], vectors[keyB]);

            if (Math.abs(r) > 0.3) { // Only store meaningful correlations
                matrix.push({
                    source: keyA,
                    target: keyB,
                    value: parseFloat(r.toFixed(2))
                });
            }
        }
    }

    return matrix;
}

function pearson(x, y) {
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

    if (denominator === 0) return 0;
    return numerator / denominator;
}

function calculateTrend(data) {
    // Simple linear regression for the last key metric provided
    // Placeholder for predictive analytics
    return { trend: 'stable', confidence: 0.8 };
}
