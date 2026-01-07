
// Vylos Labs - Daily Coach Heuristic Engine
// Generates "Insight of the Day" based on user scores.

export const getCoachInsight = (scores) => {
    if (!scores) return { text: "System calibrated. No data stream detected.", type: 'neutral' };

    const { sleep, training, nutrition, learning, screen, system } = scores;

    // 1. Critical Recovery Failure
    if (sleep < 50 && training > 80) {
        return {
            text: "CRITICAL: High training load detected with insufficient recovery. Injury risk elevated. Prioritize sleep immediately.",
            type: 'warning'
        };
    }

    // 2. High Cognitive Load Warning
    if (learning > 80 && screen < 40) {
        return {
            text: "Cognitive output is high, but digital noise is low. Excellent deep work state detected. maintain_flow.",
            type: 'success'
        };
    }

    // 3. Screen Time Burnout
    if (screen > 80 && sleep < 60) {
        return {
            text: "Dopamine loop detected. Screen time is eroding recovery windows. Initiate digital sunset 2 hours pre-sleep.",
            type: 'warning'
        };
    }

    // 4. Undereating
    if (training > 70 && nutrition < 50) {
        return {
            text: "Catabolic state risk. Training output exceeds nutritional support. Increase protein intake to support synthesis.",
            type: 'warning'
        };
    }

    // 5. System Optimization
    if (system > 85) {
        return {
            text: "System operating at peak efficiency. All metrics aligned. Push harder on Training or Learning today.",
            type: 'success'
        };
    }

    // Default neutral states
    if (sleep < 60) return { text: "Sleep debt accumulating. Cognitive latency increasing.", type: 'neutral' };
    if (training < 30) return { text: "Physical atrophy detected. Input training stimulus to maintain baseline.", type: 'neutral' };

    return {
        text: "System nominal. Awaiting specific input vectors.",
        type: 'neutral'
    };
};
