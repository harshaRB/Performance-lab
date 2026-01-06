/**
 * HISTORICAL DATA MANAGER
 * Manages 30-day rolling window of performance data
 */

/**
 * Historical Data Manager
 * Manages 30-day rolling window of performance data for trend analysis
 * @class HistoricalDataManager
 */
export class HistoricalDataManager {
    constructor() {
        this.maxDays = 30;
    }

    /**
     * Get date string for N days ago
     * @param {number} daysAgo - Number of days in the past (0 = today)
     * @returns {string} ISO date string (YYYY-MM-DD)
     */
    getDateString(daysAgo = 0) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }

    /**
     * Store today's aggregate scores
     * @param {Object} scores - Score object containing all metrics
     * @param {number} scores.learning - Learning score (0-100)
     * @param {number} scores.screen - Screen time score (0-100)
     * @param {number} scores.nutrition - Nutrition score (0-100)
     * @param {number} scores.training - Training score (0-100)
     * @param {number} scores.sleep - Sleep score (0-100)
     * @param {number} scores.system - Overall system score (0-100)
     */
    storeDailyScores(scores) {
        const today = this.getDateString(0);
        const history = this.getScoreHistory();

        history[today] = {
            ...scores,
            timestamp: Date.now()
        };

        // Keep only last 30 days
        const dates = Object.keys(history).sort().reverse();
        const trimmed = {};
        dates.slice(0, this.maxDays).forEach(date => {
            trimmed[date] = history[date];
        });

        localStorage.setItem('pl_score_history', JSON.stringify(trimmed));
    }

    /**
     * Get all historical scores
     * @returns {Object} Object with date keys and score values
     */
    getScoreHistory() {
        const stored = localStorage.getItem('pl_score_history');
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Get last N days of a specific metric
     * @param {string} metricName - Name of metric (learning, screen, nutrition, training, sleep, system)
     * @param {number} days - Number of days to retrieve (default 14)
     * @returns {Array<number>} Array of metric values
     */
    getMetricHistory(metricName, days = 14) {
        const history = this.getScoreHistory();
        const values = [];

        for (let i = days - 1; i >= 0; i--) {
            const dateStr = this.getDateString(i);
            if (history[dateStr] && history[dateStr][metricName] !== undefined) {
                values.push(history[dateStr][metricName]);
            }
        }

        return values;
    }

    // Calculate rolling baseline (mean and stddev)
    calculateBaseline(metricName, days = 14) {
        const values = this.getMetricHistory(metricName, days);

        if (values.length < 3) {
            // Not enough data, return defaults
            return { mean: 50, stddev: 15, dataPoints: values.length };
        }

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stddev = Math.sqrt(variance);

        return {
            mean,
            stddev: stddev || 1, // Prevent division by zero
            dataPoints: values.length
        };
    }

    // Get data for charts (last N days)
    getChartData(days = 7) {
        const history = this.getScoreHistory();
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const dateStr = this.getDateString(i);
            const dayData = history[dateStr];

            if (dayData) {
                data.push({
                    date: dateStr,
                    day: this.getDayLabel(i),
                    ...dayData
                });
            } else {
                // Fill missing days with null
                data.push({
                    date: dateStr,
                    day: this.getDayLabel(i),
                    system: null,
                    learning: null,
                    screen: null,
                    nutrition: null,
                    training: null,
                    sleep: null
                });
            }
        }

        return data.reverse(); // Oldest first for charts
    }

    // Get day label (Mon, Tue, etc.)
    getDayLabel(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    }

    // Export all historical data
    exportHistory() {
        return {
            scoreHistory: this.getScoreHistory(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Import historical data
    importHistory(data) {
        if (data.scoreHistory) {
            localStorage.setItem('pl_score_history', JSON.stringify(data.scoreHistory));
            return true;
        }
        return false;
    }

    // Clear all history
    clearHistory() {
        localStorage.removeItem('pl_score_history');
    }
}

export default new HistoricalDataManager();
