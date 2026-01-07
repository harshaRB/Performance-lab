/**
 * Logger Service - Sentry Integration
 * 
 * Provides error tracking, performance monitoring, and logging.
 * Only initializes in production to avoid noise during development.
 */
import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const IS_PRODUCTION = import.meta.env.PROD;

let isInitialized = false;

/**
 * Initialize Sentry error tracking
 * Call this once at app startup (e.g., in main.jsx)
 */
export const initLogger = () => {
    if (!IS_PRODUCTION) {
        console.log('[Logger] Skipping Sentry initialization in development mode');
        return;
    }

    if (!SENTRY_DSN) {
        console.warn('[Logger] Sentry DSN not found. Set VITE_SENTRY_DSN in .env');
        return;
    }

    if (isInitialized) return;

    Sentry.init({
        dsn: SENTRY_DSN,
        environment: import.meta.env.MODE,

        // Performance Monitoring
        tracesSampleRate: 0.2, // 20% of transactions

        // Session Replay (optional)
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        // Filtering
        beforeSend(event) {
            // Don't send events for common non-errors
            if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
                return null;
            }
            return event;
        },

        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],
    });

    isInitialized = true;
    console.log('[Logger] Sentry initialized');
};

/**
 * Capture an error
 * @param {Error} error - Error object to capture
 * @param {Object} context - Additional context
 */
export const captureError = (error, context = {}) => {
    if (!IS_PRODUCTION) {
        console.error('[Logger] Error:', error, context);
        return;
    }

    if (isInitialized) {
        Sentry.captureException(error, { extra: context });
    }
};

/**
 * Capture a message
 * @param {string} message - Message to log
 * @param {'info'|'warning'|'error'} level - Log level
 * @param {Object} context - Additional context
 */
export const captureMessage = (message, level = 'info', context = {}) => {
    if (!IS_PRODUCTION) {
        console.log(`[Logger] ${level.toUpperCase()}: ${message}`, context);
        return;
    }

    if (isInitialized) {
        Sentry.captureMessage(message, {
            level,
            extra: context,
        });
    }
};

/**
 * Set user context for error tracking
 * @param {Object} user - User object with id, email, etc.
 */
export const setUser = (user) => {
    if (isInitialized) {
        Sentry.setUser(user);
    }
};

/**
 * Clear user context (on logout)
 */
export const clearUser = () => {
    if (isInitialized) {
        Sentry.setUser(null);
    }
};

/**
 * Add breadcrumb for debugging
 * @param {string} message - Breadcrumb message
 * @param {string} category - Category (ui, navigation, etc.)
 * @param {Object} data - Additional data
 */
export const addBreadcrumb = (message, category = 'app', data = {}) => {
    if (isInitialized) {
        Sentry.addBreadcrumb({
            message,
            category,
            data,
            level: 'info',
        });
    }
};

/**
 * Sentry ErrorBoundary component for React
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default {
    initLogger,
    captureError,
    captureMessage,
    setUser,
    clearUser,
    addBreadcrumb,
    SentryErrorBoundary,
};
