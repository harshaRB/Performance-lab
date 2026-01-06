import { useEffect, useRef } from 'react';

/**
 * DEBOUNCED LOCALSTORAGE HOOK
 * Reduces write frequency to improve performance
 */

export const useDebouncedLocalStorage = (key, value, delay = 500) => {
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            if (value !== null && value !== undefined) {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
        }, delay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [key, value, delay]);
};

export default useDebouncedLocalStorage;
