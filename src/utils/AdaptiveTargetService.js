/**
 * ADAPTIVE TARGET SERVICE
 * Dynamic nutrition targets based on 7-day weight trends
 */

import HistoricalDataManager from './HistoricalDataManager';

class AdaptiveTargetService {
    /**
     * Calculate adaptive calorie targets based on weight trend
     * @param {object} profile - User profile with current weight, BMR
     * @returns {object} { calories, protein, carbs, fats, trend, recommendation }
     */
    static calculateAdaptiveTargets(profile) {
        const { weight, height, age, gender } = profile;

        // Calculate base BMR (Mifflin-St Jeor)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr += gender === 'male' ? 5 : -161;

        // Get 7-day weight trend
        const weightTrend = this.getWeightTrend();
        const trendDirection = this.analyzeTrend(weightTrend);

        // Adaptive calorie adjustment
        let targetCalories;
        let recommendation;

        if (trendDirection === 'increasing') {
            // Weight going up - deficit
            targetCalories = bmr * 1.35; // 15% deficit from maintenance
            recommendation = 'Deficit mode: Weight trending up. Reduced calories.';
        } else if (trendDirection === 'decreasing') {
            // Weight going down - slight surplus
            targetCalories = bmr * 1.65; // 10% surplus from maintenance
            recommendation = 'Surplus mode: Weight trending down. Increased calories.';
        } else {
            // Stable weight - maintenance
            targetCalories = bmr * 1.55;
            recommendation = 'Maintenance mode: Weight stable.';
        }

        // Calculate macro targets
        const targetProtein = weight * 2.2; // 2.2g per kg
        const targetFats = (targetCalories * 0.25) / 9; // 25% from fats
        const targetCarbs = (targetCalories - (targetProtein * 4) - (targetFats * 9)) / 4;

        return {
            bmr: Math.round(bmr),
            calories: Math.round(targetCalories),
            protein: Math.round(targetProtein),
            carbs: Math.round(targetCarbs),
            fats: Math.round(targetFats),
            trend: trendDirection,
            trendData: weightTrend,
            recommendation
        };
    }

    /**
     * Get 7-day weight trend from profile history
     */
    static getWeightTrend() {
        const weights = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const profileKey = `pl_profile_${dateStr}`;
            const savedProfile = localStorage.getItem(profileKey);

            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                if (profile.weight) {
                    weights.push({
                        date: dateStr,
                        weight: parseFloat(profile.weight)
                    });
                }
            }
        }

        return weights.reverse(); // Oldest to newest
    }

    /**
     * Analyze weight trend direction
     */
    static analyzeTrend(weightData) {
        if (weightData.length < 3) return 'stable'; // Not enough data

        // Linear regression
        const n = weightData.length;
        const sumX = weightData.reduce((sum, _, i) => sum + i, 0);
        const sumY = weightData.reduce((sum, d) => sum + d.weight, 0);
        const sumXY = weightData.reduce((sum, d, i) => sum + (i * d.weight), 0);
        const sumX2 = weightData.reduce((sum, _, i) => sum + (i * i), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        // Threshold: 0.1kg per day
        if (slope > 0.1) return 'increasing';
        if (slope < -0.1) return 'decreasing';
        return 'stable';
    }

    /**
     * Save current weight to history
     */
    static saveWeightToHistory(weight) {
        const today = new Date().toISOString().split('T')[0];
        const profile = JSON.parse(localStorage.getItem('pl_profile') || '{}');
        profile.weight = weight;

        localStorage.setItem(`pl_profile_${today}`, JSON.stringify(profile));
        localStorage.setItem('pl_profile', JSON.stringify(profile));
    }
}

export default AdaptiveTargetService;
