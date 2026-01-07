/**
 * Analytics Service - PostHog Integration
 * 
 * Provides product analytics, event tracking, and feature flags.
 * Only initializes in production to avoid polluting dev data.
 */
import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
const IS_PRODUCTION = import.meta.env.PROD;

let isInitialized = false;

/**
 * Initialize PostHog analytics
 * Call this once at app startup (e.g., in main.jsx)
 */
export const initAnalytics = () => {
    if (!IS_PRODUCTION) {
        console.log('[Analytics] Skipping initialization in development mode');
        return;
    }

    if (!POSTHOG_KEY) {
        console.warn('[Analytics] PostHog key not found. Set VITE_POSTHOG_KEY in .env');
        return;
    }

    if (isInitialized) return;

    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: 'localStorage',
        // Respect user privacy preferences
        opt_out_capturing_by_default: false,
    });

    isInitialized = true;
    console.log('[Analytics] PostHog initialized');
};

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Additional event properties
 */
export const trackEvent = (eventName, properties = {}) => {
    if (!IS_PRODUCTION) {
        console.log(`[Analytics] Event: ${eventName}`, properties);
        return;
    }

    if (isInitialized) {
        posthog.capture(eventName, properties);
    }
};

/**
 * Identify a user for analytics
 * @param {string} userId - Unique user identifier
 * @param {Object} traits - User properties (email, name, etc.)
 */
export const identifyUser = (userId, traits = {}) => {
    if (!IS_PRODUCTION) {
        console.log(`[Analytics] Identify: ${userId}`, traits);
        return;
    }

    if (isInitialized) {
        posthog.identify(userId, traits);
    }
};

/**
 * Reset user identity (on logout)
 */
export const resetUser = () => {
    if (isInitialized) {
        posthog.reset();
    }
};

/**
 * Check if a feature flag is enabled
 * @param {string} flagName - Feature flag name
 * @returns {boolean}
 */
export const isFeatureEnabled = (flagName) => {
    if (!IS_PRODUCTION || !isInitialized) {
        return false;
    }
    return posthog.isFeatureEnabled(flagName);
};

/**
 * Get feature flag payload
 * @param {string} flagName - Feature flag name
 * @returns {any}
 */
export const getFeatureFlag = (flagName) => {
    if (!IS_PRODUCTION || !isInitialized) {
        return null;
    }
    return posthog.getFeatureFlag(flagName);
};

export default {
    initAnalytics,
    trackEvent,
    identifyUser,
    resetUser,
    isFeatureEnabled,
    getFeatureFlag,
};
