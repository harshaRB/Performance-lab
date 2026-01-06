/**
 * SLEEP ANALYTICS ENGINE
 * Advanced sleep metrics: Efficiency, Social Jet Lag, Chronotype
 */

class SleepAnalytics {
    /**
     * Calculate sleep efficiency
     * @param {number} timeInBed - Hours in bed
     * @param {number} timeAsleep - Actual sleep hours
     * @returns {number} Efficiency percentage
     */
    static calculateSleepEfficiency(timeInBed, timeAsleep) {
        if (!timeInBed || timeInBed === 0) return 0;
        const efficiency = (timeAsleep / timeInBed) * 100;
        return Math.min(100, Math.max(0, efficiency));
    }

    /**
     * Calculate social jet lag (weekday vs weekend sleep patterns)
     * @param {array} sleepData - 7 days of sleep/wake times
     * @returns {object} { jetLag, weekdayAvg, weekendAvg }
     */
    static calculateSocialJetLag(sleepData) {
        const weekdayWakeTimes = [];
        const weekendWakeTimes = [];

        sleepData.forEach(day => {
            if (!day.wakeTime) return;

            const date = new Date(day.date);
            const dayOfWeek = date.getDay();
            const wakeMinutes = this.timeToMinutes(day.wakeTime);

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendWakeTimes.push(wakeMinutes);
            } else {
                weekdayWakeTimes.push(wakeMinutes);
            }
        });

        if (weekdayWakeTimes.length === 0 || weekendWakeTimes.length === 0) {
            return { jetLag: 0, weekdayAvg: null, weekendAvg: null };
        }

        const weekdayAvg = weekdayWakeTimes.reduce((a, b) => a + b, 0) / weekdayWakeTimes.length;
        const weekendAvg = weekendWakeTimes.reduce((a, b) => a + b, 0) / weekendWakeTimes.length;

        const jetLag = Math.abs(weekendAvg - weekdayAvg) / 60; // Convert to hours

        return {
            jetLag: jetLag.toFixed(1),
            weekdayAvg: this.minutesToTime(weekdayAvg),
            weekendAvg: this.minutesToTime(weekendAvg)
        };
    }

    /**
     * Detect chronotype (Lark or Owl)
     * @param {array} sleepData - Historical sleep onset times
     * @returns {string} 'lark', 'owl', or 'intermediate'
     */
    static detectChronotype(sleepData) {
        const sleepTimes = sleepData
            .filter(d => d.sleepTime)
            .map(d => this.timeToMinutes(d.sleepTime));

        if (sleepTimes.length < 5) return 'insufficient_data';

        const avgSleepTime = sleepTimes.reduce((a, b) => a + b, 0) / sleepTimes.length;
        const avgHour = avgSleepTime / 60;

        // Lark: Sleep before 22:00 (1320 minutes)
        // Owl: Sleep after 00:00 (1440 minutes / 0 minutes)
        if (avgHour < 22) return 'lark';
        if (avgHour > 24 || avgHour < 1) return 'owl';
        return 'intermediate';
    }

    /**
     * Get chronotype emoji and description
     */
    static getChronotypeInfo(chronotype) {
        const info = {
            lark: { emoji: '🌅', name: 'Early Bird (Lark)', description: 'Peak performance in morning hours' },
            owl: { emoji: '🦉', name: 'Night Owl', description: 'Peak performance in evening hours' },
            intermediate: { emoji: '🕐', name: 'Intermediate', description: 'Flexible circadian rhythm' },
            insufficient_data: { emoji: '❓', name: 'Unknown', description: 'Need more sleep data' }
        };
        return info[chronotype] || info.insufficient_data;
    }

    /**
     * Convert HH:MM to minutes since midnight
     */
    static timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    /**
     * Convert minutes to HH:MM
     */
    static minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    /**
     * Get sleep data from history
     */
    static getSleepHistory(days = 7) {
        const sleepData = [];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const sleepTime = localStorage.getItem(`pl_sleep_time_${dateStr}`) || localStorage.getItem('pl_sleep_time');
            const wakeTime = localStorage.getItem(`pl_wake_time_${dateStr}`) || localStorage.getItem('pl_wake_time');
            const duration = parseFloat(localStorage.getItem(`pl_sleep_duration_${dateStr}`)) || 0;

            if (sleepTime || wakeTime || duration) {
                sleepData.push({
                    date: dateStr,
                    sleepTime,
                    wakeTime,
                    duration
                });
            }
        }

        return sleepData;
    }
}

export default SleepAnalytics;
