/**
 * BAYESIAN IMPUTATION ENGINE
 * Intelligent missing data inference using historical patterns
 */

import HistoricalDataManager from './HistoricalDataManager';

class BayesianImputation {
    /**
     * Impute missing score using Bayesian inference
     * @param {string} metricName - Name of metric to impute
     * @param {string} date - Date of missing data
     * @returns {object} { value, confidence, method }
     */
    static imputeMissingScore(metricName, date) {
        const history = HistoricalDataManager.getMetricHistory(metricName, 30);

        // Not enough data for imputation
        if (history.length < 3) {
            return {
                value: 50, // Population mean fallback
                confidence: 'none',
                method: 'population_mean',
                isImputed: true
            };
        }

        // Calculate prior (historical mean)
        const prior = {
            mean: history.reduce((a, b) => a + b, 0) / history.length,
            variance: this.calculateVariance(history)
        };

        // Get day-of-week pattern
        const dayOfWeek = new Date(date).getDay();
        const sameDayHistory = this.getSameDayOfWeekHistory(metricName, dayOfWeek);

        // Bayesian update
        let posterior;
        if (sameDayHistory.length >= 2) {
            const likelihood = {
                mean: sameDayHistory.reduce((a, b) => a + b, 0) / sameDayHistory.length,
                variance: this.calculateVariance(sameDayHistory)
            };

            // Combine prior and likelihood
            posterior = this.bayesianUpdate(prior, likelihood);
        } else {
            posterior = prior;
        }

        // Determine confidence based on data availability
        const confidence = this.calculateConfidence(history.length, sameDayHistory.length);

        return {
            value: Math.round(posterior.mean),
            confidence,
            method: sameDayHistory.length >= 2 ? 'bayesian_day_pattern' : 'historical_mean',
            isImputed: true,
            uncertainty: Math.round(Math.sqrt(posterior.variance))
        };
    }

    /**
     * Bayesian update: combine prior and likelihood
     */
    static bayesianUpdate(prior, likelihood) {
        const priorPrecision = 1 / prior.variance;
        const likelihoodPrecision = 1 / likelihood.variance;

        const posteriorPrecision = priorPrecision + likelihoodPrecision;
        const posteriorVariance = 1 / posteriorPrecision;

        const posteriorMean = (priorPrecision * prior.mean + likelihoodPrecision * likelihood.mean) / posteriorPrecision;

        return {
            mean: posteriorMean,
            variance: posteriorVariance
        };
    }

    /**
     * Get historical data for same day of week
     */
    static getSameDayOfWeekHistory(metricName, targetDayOfWeek) {
        const allHistory = HistoricalDataManager.getScoreHistory();
        const values = [];

        Object.entries(allHistory).forEach(([dateStr, data]) => {
            const date = new Date(dateStr);
            if (date.getDay() === targetDayOfWeek && data[metricName] !== undefined) {
                values.push(data[metricName]);
            }
        });

        return values;
    }

    /**
     * Calculate variance
     */
    static calculateVariance(values) {
        if (values.length < 2) return 100; // High uncertainty

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;

        return variance || 1; // Prevent division by zero
    }

    /**
     * Calculate confidence level
     */
    static calculateConfidence(totalDataPoints, sameDayDataPoints) {
        if (totalDataPoints < 3) return 'none';
        if (totalDataPoints < 7) return 'low';
        if (sameDayDataPoints >= 3) return 'high';
        if (totalDataPoints >= 14) return 'medium';
        return 'low';
    }

    /**
     * Fill gaps in time series data
     */
    static fillGaps(data, metricName) {
        const filled = [];
        const dates = data.map(d => d.date).sort();

        if (dates.length === 0) return filled;

        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[dates.length - 1]);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const existing = data.find(item => item.date === dateStr);

            if (existing && existing[metricName] !== null) {
                filled.push({
                    ...existing,
                    isImputed: false
                });
            } else {
                const imputed = this.imputeMissingScore(metricName, dateStr);
                filled.push({
                    date: dateStr,
                    day: this.getDayLabel(d),
                    [metricName]: imputed.value,
                    ...imputed
                });
            }
        }

        return filled;
    }

    /**
     * Get day label
     */
    static getDayLabel(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    }
}

export default BayesianImputation;
