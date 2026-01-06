/**
 * STATISTICAL ANALYSIS ENGINE
 * Correlation matrix and multi-variate regression
 */

import HistoricalDataManager from './HistoricalDataManager';

/**
 * Statistical Analysis Engine
 * Provides correlation matrix and multi-variate regression analysis
 * @class StatAnalysis
 */
class StatAnalysis {
    /**
     * Calculate Pearson correlation coefficient between two metrics
     * @param {Array<number>} x - First metric values
     * @param {Array<number>} y - Second metric values
     * @returns {number} Correlation coefficient (-1 to 1, where -1 is perfect negative, 0 is no correlation, 1 is perfect positive)
     */
    static pearsonCorrelation(x, y) {
        if (x.length !== y.length || x.length < 3) return 0;

        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (denominator === 0) return 0;
        return numerator / denominator;
    }

    /**
     * Generate correlation matrix for all metrics
     * @param {number} days - Number of days to analyze
     * @returns {object} Correlation matrix
     */
    static generateCorrelationMatrix(days = 30) {
        const metrics = ['learning', 'screen', 'nutrition', 'training', 'sleep', 'system'];
        const data = HistoricalDataManager.getChartData(days);

        const matrix = {};

        metrics.forEach(metric1 => {
            matrix[metric1] = {};

            metrics.forEach(metric2 => {
                const values1 = data.map(d => d[metric1]).filter(v => v !== null && v !== undefined);
                const values2 = data.map(d => d[metric2]).filter(v => v !== null && v !== undefined);

                // Align arrays (only use indices where both have data)
                const aligned1 = [];
                const aligned2 = [];

                data.forEach(d => {
                    if (d[metric1] !== null && d[metric2] !== null) {
                        aligned1.push(d[metric1]);
                        aligned2.push(d[metric2]);
                    }
                });

                const correlation = this.pearsonCorrelation(aligned1, aligned2);
                matrix[metric1][metric2] = parseFloat(correlation.toFixed(3));
            });
        });

        return matrix;
    }

    /**
     * Find strongest correlations
     * @param {object} matrix - Correlation matrix
     * @returns {array} Top correlations
     */
    static findStrongestCorrelations(matrix) {
        const correlations = [];

        Object.keys(matrix).forEach(metric1 => {
            Object.keys(matrix[metric1]).forEach(metric2 => {
                if (metric1 !== metric2) {
                    const value = matrix[metric1][metric2];
                    correlations.push({
                        metric1,
                        metric2,
                        correlation: value,
                        strength: Math.abs(value)
                    });
                }
            });
        });

        // Remove duplicates (A-B and B-A)
        const unique = [];
        const seen = new Set();

        correlations.forEach(c => {
            const key = [c.metric1, c.metric2].sort().join('-');
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(c);
            }
        });

        return unique.sort((a, b) => b.strength - a.strength).slice(0, 5);
    }

    /**
     * Multi-variate regression: Find which variables impact target most
     * @param {string} targetMetric - Dependent variable
     * @param {array} predictors - Independent variables
     * @returns {object} Regression coefficients
     */
    static multiVariateRegression(targetMetric, predictors = ['learning', 'screen', 'nutrition', 'training', 'sleep']) {
        const data = HistoricalDataManager.getChartData(30);

        // Filter complete cases
        const completeCases = data.filter(d => {
            return d[targetMetric] !== null && predictors.every(p => d[p] !== null);
        });

        if (completeCases.length < 10) {
            return { error: 'Insufficient data for regression' };
        }

        // Simple multiple regression (OLS approximation)
        const y = completeCases.map(d => d[targetMetric]);
        const coefficients = {};

        predictors.forEach(predictor => {
            const x = completeCases.map(d => d[predictor]);
            const correlation = this.pearsonCorrelation(x, y);

            // Standardized coefficient (beta)
            const stdX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - (x.reduce((a, b) => a + b, 0) / x.length), 2), 0) / x.length);
            const stdY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - (y.reduce((a, b) => a + b, 0) / y.length), 2), 0) / y.length);

            const beta = correlation * (stdY / stdX);

            coefficients[predictor] = {
                correlation: parseFloat(correlation.toFixed(3)),
                beta: parseFloat(beta.toFixed(3)),
                impact: Math.abs(beta)
            };
        });

        // Rank by impact
        const ranked = Object.entries(coefficients)
            .sort((a, b) => b[1].impact - a[1].impact)
            .map(([metric, stats]) => ({ metric, ...stats }));

        return {
            target: targetMetric,
            predictors: ranked,
            topPredictor: ranked[0]?.metric,
            sampleSize: completeCases.length
        };
    }

    /**
     * Get interpretation of correlation strength
     */
    static interpretCorrelation(r) {
        const abs = Math.abs(r);
        if (abs >= 0.7) return 'Strong';
        if (abs >= 0.4) return 'Moderate';
        if (abs >= 0.2) return 'Weak';
        return 'Negligible';
    }
}

export default StatAnalysis;
