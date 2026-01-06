
import { describe, it, expect, vi } from 'vitest';
import {
    calculateZScore,
    calculateFatiguePenalty,
    calculateMacroScore
} from './Biostatistics';

// Mock HistoricalDataManager since it's a dependency
// We'll mock it to return a fixed baseline
vi.mock('./HistoricalDataManager', () => ({
    default: {
        calculateBaseline: (metric, days) => ({
            mean: 50,
            stddev: 10,
            dataPoints: 14
        })
    }
}));

describe('Biostatistics Core', () => {

    describe('Z-Score Calculation', () => {
        it('should calculate positive z-score correctly', () => {
            // Mean 50, StdDev 10. Current 70. Z should be (70-50)/10 = 2.0
            const z = calculateZScore(70, 'test_metric');
            expect(z).toBeCloseTo(2.0);
        });

        it('should calculate negative z-score correctly', () => {
            // Mean 50, StdDev 10. Current 40. Z should be (40-50)/10 = -1.0
            const z = calculateZScore(40, 'test_metric');
            expect(z).toBeCloseTo(-1.0);
        });
    });

    describe('Fatigue Penalty', () => {
        it('should return 1 (no penalty) when volume is optimal', () => {
            const penalty = calculateFatiguePenalty(5000, 10000); // 5k < 10k
            expect(penalty).toBe(1);
        });

        it('should apply penalty when volume exceeds optimal', () => {
            // Excess = 12k - 10k = 2k. 
            // Penalty = 1 - (2k^2 / 10k^2) = 1 - (4M / 100M) = 1 - 0.04 = 0.96
            const penalty = calculateFatiguePenalty(12000, 10000);
            expect(penalty).toBeCloseTo(0.96);
        });
    });

    describe('Macro Score', () => {
        const optimal = { protein: 150, carbs: 200, fats: 70 };

        it('should return 100 for perfect match', () => {
            const score = calculateMacroScore(optimal, optimal);
            expect(score).toBe(100);
        });

        it('should decay score as difference increases', () => {
            const actual = { protein: 100, carbs: 200, fats: 70 }; // 50 diff
            // exp(-50/50) * 100 = exp(-1) * 100 = ~36.78
            const score = calculateMacroScore(actual, optimal, 50);
            expect(score).toBeCloseTo(36.78, 1);
        });
    });

});
