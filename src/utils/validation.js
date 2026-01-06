/**
 * INPUT VALIDATION UTILITIES
 * Prevents bad data from corrupting the system
 */

export const validators = {
    // Profile validation
    age: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 10 || num > 100) return { valid: false, error: 'Age must be 10-100' };
        return { valid: true };
    },

    weight: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 30 || num > 200) return { valid: false, error: 'Weight must be 30-200kg' };
        return { valid: true };
    },

    height: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 100 || num > 250) return { valid: false, error: 'Height must be 100-250cm' };
        return { valid: true };
    },

    circumference: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 10 || num > 200) return { valid: false, error: 'Must be 10-200cm' };
        return { valid: true };
    },

    // General positive number
    positiveNumber: (val, max = 10000) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 0) return { valid: false, error: 'Cannot be negative' };
        if (num > max) return { valid: false, error: `Max ${max}` };
        return { valid: true };
    },

    // Minutes (0-1440)
    minutes: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 0) return { valid: false, error: 'Cannot be negative' };
        if (num > 1440) return { valid: false, error: 'Max 1440 min (24h)' };
        return { valid: true };
    },

    // Hours (0-24)
    hours: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 0) return { valid: false, error: 'Cannot be negative' };
        if (num > 24) return { valid: false, error: 'Max 24 hours' };
        return { valid: true };
    },

    // Steps (0-100000)
    steps: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 0) return { valid: false, error: 'Cannot be negative' };
        if (num > 100000) return { valid: false, error: 'Unrealistic (>100k)' };
        return { valid: true };
    },

    // Grams (nutrition)
    grams: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 0) return { valid: false, error: 'Cannot be negative' };
        if (num > 10000) return { valid: false, error: 'Max 10000g' };
        return { valid: true };
    },

    // Milliliters (hydration)
    milliliters: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 0) return { valid: false, error: 'Cannot be negative' };
        if (num > 10000) return { valid: false, error: 'Max 10L' };
        return { valid: true };
    },

    // Quality score (1-10)
    quality: (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return { valid: false, error: 'Must be a number' };
        if (num < 1 || num > 10) return { valid: false, error: 'Must be 1-10' };
        return { valid: true };
    },

    // Required text
    requiredText: (val) => {
        if (!val || val.trim() === '') return { valid: false, error: 'Required' };
        if (val.length > 100) return { valid: false, error: 'Max 100 chars' };
        return { valid: true };
    }
};

// Helper to validate and sanitize input
export const validateAndSanitize = (value, validatorName) => {
    const validator = validators[validatorName];
    if (!validator) return { value, valid: true };

    const result = validator(value);
    if (result.valid) {
        return { value: parseFloat(value) || value, valid: true };
    }
    return { value, valid: false, error: result.error };
};
