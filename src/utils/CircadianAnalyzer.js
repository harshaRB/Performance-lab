/**
 * CIRCADIAN RHYTHM ANALYSIS
 * Tracks sleep schedule consistency and alignment
 */

export class CircadianAnalyzer {
    // Calculate circadian alignment score
    static calculateAlignment(sleepTime, wakeTime) {
        if (!sleepTime || !wakeTime) return { score: 50, penalty: 0, socialJetLag: 0 };

        // Parse times (HH:MM format)
        const [sleepH, sleepM] = sleepTime.split(':').map(Number);
        const [wakeH, wakeM] = wakeTime.split(':').map(Number);

        // Convert to minutes from midnight
        let sleepMins = sleepH * 60 + sleepM;
        let wakeMins = wakeH * 60 + wakeM;

        // Adjust for sleep after midnight (e.g., 1 AM = 25:00)
        if (sleepH < 12) sleepMins += 24 * 60;

        // Optimal sleep window: 22:00-24:00 (10 PM - midnight)
        const optimalSleepStart = 22 * 60;
        const optimalSleepEnd = 24 * 60;

        // Optimal wake window: 06:00-08:00
        const optimalWakeStart = 6 * 60;
        const optimalWakeEnd = 8 * 60;

        // Calculate deviations
        let sleepDeviation = 0;
        if (sleepMins < optimalSleepStart) {
            sleepDeviation = optimalSleepStart - sleepMins;
        } else if (sleepMins > optimalSleepEnd) {
            sleepDeviation = sleepMins - optimalSleepEnd;
        }

        let wakeDeviation = 0;
        if (wakeMins < optimalWakeStart) {
            wakeDeviation = optimalWakeStart - wakeMins;
        } else if (wakeMins > optimalWakeEnd) {
            wakeDeviation = wakeMins - optimalWakeEnd;
        }

        // Total deviation in hours
        const totalDeviation = (sleepDeviation + wakeDeviation) / 60;

        // Score: exponential decay based on deviation
        const alignmentScore = Math.exp(-totalDeviation / 2) * 100;

        return {
            score: Math.round(alignmentScore),
            sleepDeviation: Math.round(sleepDeviation),
            wakeDeviation: Math.round(wakeDeviation),
            totalDeviation: totalDeviation.toFixed(1)
        };
    }

    // Calculate social jet lag (weekday vs weekend difference)
    static calculateSocialJetLag(weekdayMidpoint, weekendMidpoint) {
        if (!weekdayMidpoint || !weekendMidpoint) return 0;

        // Midpoint = (sleep + wake) / 2
        const diff = Math.abs(weekendMidpoint - weekdayMidpoint);
        return diff; // In hours
    }

    // Calculate sleep schedule consistency (7-day variance)
    static calculateConsistency(sleepTimes) {
        if (sleepTimes.length < 3) return { score: 50, variance: 0 };

        // Convert times to minutes
        const mins = sleepTimes.map(t => {
            const [h, m] = t.split(':').map(Number);
            let total = h * 60 + m;
            if (h < 12) total += 24 * 60; // Adjust for post-midnight
            return total;
        });

        // Calculate variance
        const mean = mins.reduce((a, b) => a + b, 0) / mins.length;
        const variance = mins.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / mins.length;
        const stddev = Math.sqrt(variance);

        // Score: lower variance = higher score
        // Perfect consistency (0 variance) = 100
        // 2hr stddev = ~50 score
        const consistencyScore = Math.exp(-stddev / 60) * 100;

        return {
            score: Math.round(consistencyScore),
            variance: Math.round(variance),
            stddev: Math.round(stddev)
        };
    }

    // Get circadian phase (chronotype estimation)
    static estimateChronotype(avgSleepTime) {
        if (!avgSleepTime) return 'Unknown';

        const [h, m] = avgSleepTime.split(':').map(Number);
        let mins = h * 60 + m;
        if (h < 12) mins += 24 * 60;

        // Chronotype classification
        if (mins < 22 * 60) return 'Lark (Early Bird)';
        if (mins < 23 * 60) return 'Intermediate';
        if (mins < 24 * 60) return 'Slightly Late';
        if (mins < 25 * 60) return 'Owl (Night Owl)';
        return 'Extreme Owl';
    }
}

export default CircadianAnalyzer;
