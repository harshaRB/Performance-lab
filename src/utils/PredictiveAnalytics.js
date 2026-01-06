/**
 * PREDICTIVE ANALYTICS ENGINE
 * ARIMA-inspired forecasting with linear regression fallback
 */

import HistoricalDataManager from './HistoricalDataManager';

class PredictiveAnalytics {
    /**
     * Forecast metric for next N days using linear regression
     * @param {string} metricName - Metric to forecast
     * @param {number} days - Days to forecast (default 7)
     * @returns {array} Forecast data
     */
    static forecastMetric(metricName, days = 7) {
        const history = HistoricalDataManager.getMetricHistory(metricName, 30);

        if (history.length < 7) {
            return { error: 'Insufficient historical data', forecast: [] };
        }

        // Linear regression on historical data
        const { slope, intercept } = this.linearRegression(history);

        // Generate forecast
        const forecast = [];
        const lastIndex = history.length - 1;

        for (let i = 1; i <= days; i++) {
            const predictedValue = slope * (lastIndex + i) + intercept;
            const bounded = Math.max(0, Math.min(100, predictedValue)); // Bound to [0, 100]

            forecast.push({
                day: i,
                value: Math.round(bounded),
                confidence: this.calculateConfidence(i, history.length)
            });
        }

        return {
            metric: metricName,
            forecast,
            trend: slope > 0.5 ? 'improving' : slope < -0.5 ? 'declining' : 'stable',
            slope: slope.toFixed(2)
        };
    }

    /**
     * Linear regression
     */
    static linearRegression(values) {
        const n = values.length;
        const sumX = values.reduce((sum, _, i) => sum + i, 0);
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0);
        const sumX2 = values.reduce((sum, _, i) => sum + (i * i), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    }

    /**
     * Calculate forecast confidence (decreases with distance)
     */
    static calculateConfidence(daysAhead, historicalDataPoints) {
        const baseConfidence = Math.min(100, (historicalDataPoints / 30) * 100);
        const decayFactor = Math.exp(-daysAhead / 7); // Exponential decay
        return Math.round(baseConfidence * decayFactor);
    }

    /**
     * Forecast all metrics
     */
    static forecastAll(days = 7) {
        const metrics = ['learning', 'screen', 'nutrition', 'training', 'sleep', 'system'];
        const forecasts = {};

        metrics.forEach(metric => {
            forecasts[metric] = this.forecastMetric(metric, days);
        });

        return forecasts;
    }

    /**
     * Calculate goal achievement probability
     * @param {string} metric - Metric name
     * @param {number} targetScore - Goal score
     * @param {number} daysToGoal - Days until goal deadline
     * @returns {object} Probability and analysis
     */
    static calculateGoalProbability(metric, targetScore, daysToGoal) {
        const history = HistoricalDataManager.getMetricHistory(metric, 30);

        if (history.length < 3) {
            return { probability: 0, message: 'Insufficient data' };
        }

        const currentScore = history[history.length - 1];
        const { slope } = this.linearRegression(history);

        const projectedScore = currentScore + (slope * daysToGoal);
        const gap = targetScore - currentScore;
        const requiredSlope = gap / daysToGoal;

        // Probability based on current trend vs required trend
        const probability = Math.min(100, Math.max(0,
            100 * (1 - Math.abs(requiredSlope - slope) / Math.abs(requiredSlope || 1))
        ));

        let message;
        if (probability >= 70) message = 'Highly likely to achieve goal';
        else if (probability >= 40) message = 'Possible with increased effort';
        else message = 'Goal may be too ambitious for timeframe';

        return {
            probability: Math.round(probability),
            currentScore,
            targetScore,
            projectedScore: Math.round(projectedScore),
            gap: Math.round(gap),
            requiredDailyGain: requiredSlope.toFixed(2),
            currentTrend: slope.toFixed(2),
            message
        };
    }
}

export default PredictiveAnalytics;
