import React, { useEffect, useState } from 'react';

// Custom hook for number animation
const useCountUp = (end, duration = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let startValue = count;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing: OutExpo (flips fast, slows down at end for 'mechanical' feel)
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(startValue + (end - startValue) * ease);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [end, duration]);

    return count;
};

const NumberMorph = ({ value, decimals = 0, prefix = '', suffix = '' }) => {
    // Ensure we animate to the new value
    const displayValue = useCountUp(parseFloat(value) || 0);

    return (
        <span>
            {prefix}
            {displayValue.toFixed(decimals)}
            {suffix}
        </span>
    );
};

export default NumberMorph;
