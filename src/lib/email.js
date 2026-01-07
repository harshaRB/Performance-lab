/**
 * Email Service - Resend Integration
 * 
 * NOTE: Resend requires server-side API calls for security.
 * This module provides helper functions that would typically
 * call your backend API endpoints.
 * 
 * For a full implementation, create API routes (e.g., in Next.js or a separate backend)
 * that use the Resend SDK with your API key.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Send a welcome email to a new user
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await fetch(`${API_BASE}/email/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
        });

        if (!response.ok) {
            throw new Error('Failed to send welcome email');
        }

        return { success: true };
    } catch (error) {
        console.error('[Email] Welcome email failed:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send a weekly progress report
 * @param {string} email - User's email address
 * @param {Object} reportData - Weekly report data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendWeeklyReport = async (email, reportData) => {
    try {
        const response = await fetch(`${API_BASE}/email/weekly-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, reportData }),
        });

        if (!response.ok) {
            throw new Error('Failed to send weekly report');
        }

        return { success: true };
    } catch (error) {
        console.error('[Email] Weekly report email failed:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send a password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const response = await fetch(`${API_BASE}/email/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resetToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to send password reset email');
        }

        return { success: true };
    } catch (error) {
        console.error('[Email] Password reset email failed:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send an achievement notification
 * @param {string} email - User's email address
 * @param {Object} achievement - Achievement data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendAchievementEmail = async (email, achievement) => {
    try {
        const response = await fetch(`${API_BASE}/email/achievement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, achievement }),
        });

        if (!response.ok) {
            throw new Error('Failed to send achievement email');
        }

        return { success: true };
    } catch (error) {
        console.error('[Email] Achievement email failed:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendWelcomeEmail,
    sendWeeklyReport,
    sendPasswordResetEmail,
    sendAchievementEmail,
};
