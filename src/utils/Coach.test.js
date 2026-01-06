
import { describe, it, expect } from 'vitest';
import { getCoachInsight } from './Coach';

describe('Coach Heuristic Engine', () => {

    it('should detect critical recovery failure', () => {
        const scores = {
            sleep: 40,
            training: 85,
            nutrition: 50,
            learning: 50,
            screen: 50,
            system: 0
        };
        const result = getCoachInsight(scores);
        expect(result.type).toBe('warning');
        expect(result.text).toContain('CRITICAL');
    });

    it('should praise high cognitive flow', () => {
        const scores = {
            sleep: 70,
            training: 50,
            nutrition: 50,
            learning: 85,
            screen: 30, // low noise
            system: 0
        };
        const result = getCoachInsight(scores);
        expect(result.type).toBe('success');
        expect(result.text).toContain('deep work');
    });

    it('should warn about screen burnout', () => {
        const scores = {
            sleep: 50,
            training: 50,
            nutrition: 50,
            learning: 50,
            screen: 85,
            system: 0
        };
        const result = getCoachInsight(scores);
        expect(result.type).toBe('warning');
        expect(result.text).toContain('Dopamine loop');
    });

    it('should return neutral state for balanced low metrics', () => {
        const scores = {
            sleep: 65,
            training: 40,
            nutrition: 60,
            learning: 60,
            screen: 60,
            system: 60
        };
        const result = getCoachInsight(scores);
        expect(result.type).toBe('neutral');
        expect(result.text).toContain('System nominal');
    });

    it('should handle missing data gracefully', () => {
        const result = getCoachInsight(null);
        expect(result.text).toContain('No data stream');
    });
});
