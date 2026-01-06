/**
 * RECOMMENDATION ENGINE
 * AI-powered daily coaching suggestions
 */

class RecommendationEngine {
    /**
     * Generate daily recommendations based on current state
     * @param {object} scores - Current module scores
     * @param {object} profile - User profile
     * @returns {array} Recommendations
     */
    static generateRecommendations(scores, profile) {
        const recommendations = [];

        // Sleep-based recommendations
        if (scores.sleep < 60) {
            recommendations.push({
                priority: 'high',
                category: 'recovery',
                icon: '😴',
                title: 'Sleep Deficit Detected',
                message: 'Consider high-carb breakfast for energy. Avoid intense training today.',
                action: 'Prioritize 8+ hours tonight'
            });
        }

        // Training recovery
        const volumeLoad = parseFloat(localStorage.getItem('pl_training_volume')) || 0;
        if (volumeLoad > 15000 && scores.sleep < 70) {
            recommendations.push({
                priority: 'critical',
                category: 'recovery',
                icon: '⚠️',
                title: 'Overtraining Risk',
                message: 'High volume + poor sleep = injury risk. Take a rest day.',
                action: 'Active recovery or complete rest'
            });
        }

        // Nutrition optimization
        if (scores.nutrition < 70) {
            const hydration = parseFloat(localStorage.getItem(`pl_hydration_${new Date().toISOString().split('T')[0]}`)) || 0;

            if (hydration < 2000) {
                recommendations.push({
                    priority: 'medium',
                    category: 'nutrition',
                    icon: '💧',
                    title: 'Hydration Low',
                    message: 'Drink 1L water in next 2 hours. Boosts nutrition score by 5-15%.',
                    action: 'Target 3L total today'
                });
            } else {
                recommendations.push({
                    priority: 'medium',
                    category: 'nutrition',
                    icon: '🥗',
                    title: 'Macro Balance Needed',
                    message: 'Focus on protein-rich meals. Target: ' + Math.round(profile.weight * 2.2) + 'g protein.',
                    action: 'Log complete meals'
                });
            }
        }

        // Learning optimization
        if (scores.learning < 60) {
            recommendations.push({
                priority: 'medium',
                category: 'learning',
                icon: '📚',
                title: 'Learning Deficit',
                message: 'Active learning has 1.5x impact. 30 min active > 45 min passive.',
                action: 'Schedule focused study block'
            });
        }

        // Screen time warning
        if (scores.screen < 70) {
            recommendations.push({
                priority: 'low',
                category: 'productivity',
                icon: '📱',
                title: 'Screen Time Penalty',
                message: 'Social/entertainment have quadratic penalties. Reduce by 30 min.',
                action: 'Set app time limits'
            });
        }

        // System score optimization
        if (scores.system < 70) {
            // Find weakest module
            const modules = [
                { name: 'learning', score: scores.learning },
                { name: 'screen', score: scores.screen },
                { name: 'nutrition', score: scores.nutrition },
                { name: 'training', score: scores.training },
                { name: 'sleep', score: scores.sleep }
            ];

            const weakest = modules.sort((a, b) => a.score - b.score)[0];

            recommendations.push({
                priority: 'high',
                category: 'optimization',
                icon: '🎯',
                title: 'Focus on ' + weakest.name.charAt(0).toUpperCase() + weakest.name.slice(1),
                message: `Weakest module (${weakest.score}). Geometric mean amplifies weak links.`,
                action: 'Improve this module first'
            });
        }

        // Positive reinforcement
        if (scores.system >= 85) {
            recommendations.push({
                priority: 'low',
                category: 'motivation',
                icon: '🏆',
                title: 'Elite Performance',
                message: 'System score above 85. Maintain consistency for long-term gains.',
                action: 'Keep up the momentum'
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    /**
     * Get motivational quote based on performance
     */
    static getMotivationalQuote(systemScore) {
        if (systemScore >= 90) {
            return {
                quote: "Excellence is not a destination; it is a continuous journey that never ends.",
                author: "Brian Tracy"
            };
        } else if (systemScore >= 70) {
            return {
                quote: "Success is the sum of small efforts repeated day in and day out.",
                author: "Robert Collier"
            };
        } else {
            return {
                quote: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            };
        }
    }
}

export default RecommendationEngine;
