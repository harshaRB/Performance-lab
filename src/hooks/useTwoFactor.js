/**
 * useTwoFactor Hook
 * 
 * Manages Two-Factor Authentication (TOTP) using Supabase MFA.
 * Provides enrollment, verification, and status checking capabilities.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useTwoFactor = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [factors, setFactors] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Check if user has MFA enabled
     */
    const checkMFAStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Guard: Supabase not configured (demo mode)
            if (!supabase) {
                setIsEnabled(false);
                setFactors([]);
                setIsLoading(false);
                return { enabled: false, factors: [] };
            }

            const { data, error } = await supabase.auth.mfa.listFactors();

            if (error) throw error;

            const totpFactors = data?.totp || [];
            const verifiedFactors = totpFactors.filter(f => f.status === 'verified');

            setFactors(totpFactors);
            setIsEnabled(verifiedFactors.length > 0);

            return { enabled: verifiedFactors.length > 0, factors: totpFactors };
        } catch (err) {
            console.error('[2FA] Error checking MFA status:', err);
            setError(err.message);
            return { enabled: false, factors: [] };
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Start TOTP enrollment - generates QR code
     */
    const enrollTOTP = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Guard: Supabase not configured (demo mode)
            if (!supabase) {
                setError('Two-factor authentication requires Supabase configuration');
                setIsLoading(false);
                return { success: false, error: 'Supabase not configured' };
            }

            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
                friendlyName: 'Vylos Labs Authenticator',
            });

            if (error) throw error;

            setEnrollmentData({
                id: data.id,
                qrCode: data.totp.qr_code,
                secret: data.totp.secret,
                uri: data.totp.uri,
            });

            return { success: true, data: data };
        } catch (err) {
            console.error('[2FA] Error enrolling TOTP:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Verify TOTP code to complete enrollment
     */
    const verifyTOTP = async (code, factorId = null) => {
        setIsLoading(true);
        setError(null);

        const id = factorId || enrollmentData?.id;

        if (!id) {
            setError('No enrollment in progress');
            setIsLoading(false);
            return { success: false, error: 'No enrollment in progress' };
        }

        try {
            const { data: _data, error } = await supabase.auth.mfa.challengeAndVerify({
                factorId: id,
                code: code,
            });

            if (error) throw error;

            setIsEnabled(true);
            setEnrollmentData(null);
            await checkMFAStatus();

            return { success: true };
        } catch (err) {
            console.error('[2FA] Error verifying TOTP:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Unenroll/disable TOTP
     */
    const unenrollTOTP = async (factorId = null) => {
        setIsLoading(true);
        setError(null);

        try {
            // Guard: Supabase not configured (demo mode)
            if (!supabase) {
                setError('Two-factor authentication requires Supabase configuration');
                setIsLoading(false);
                return { success: false, error: 'Supabase not configured' };
            }

            const id = factorId || factors[0]?.id;

            if (!id) {
                throw new Error('No TOTP factor found to unenroll');
            }

            const { error } = await supabase.auth.mfa.unenroll({
                factorId: id,
            });

            if (error) throw error;

            setIsEnabled(false);
            setFactors([]);

            return { success: true };
        } catch (err) {
            console.error('[2FA] Error unenrolling TOTP:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Cancel enrollment (if user abandons setup)
     */
    const cancelEnrollment = async () => {
        if (enrollmentData?.id) {
            try {
                await supabase.auth.mfa.unenroll({
                    factorId: enrollmentData.id,
                });
            } catch (err) {
                // Ignore errors during cancellation
            }
        }
        setEnrollmentData(null);
    };

    /**
     * Verify MFA challenge during sign-in
     */
    const verifyChallenge = async (factorId, code) => {
        setIsLoading(true);
        setError(null);

        try {
            // Guard: Supabase not configured (demo mode)
            if (!supabase) {
                setError('Two-factor authentication requires Supabase configuration');
                setIsLoading(false);
                return { success: false, error: 'Supabase not configured' };
            }

            const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
                factorId,
            });

            if (challengeError) throw challengeError;

            const { data, error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.id,
                code,
            });

            if (verifyError) throw verifyError;

            return { success: true, data };
        } catch (err) {
            console.error('[2FA] Error verifying challenge:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Check MFA status on mount
    useEffect(() => {
        checkMFAStatus();
    }, [checkMFAStatus]);

    return {
        // State
        isEnabled,
        isLoading,
        factors,
        enrollmentData,
        error,

        // Actions
        checkMFAStatus,
        enrollTOTP,
        verifyTOTP,
        unenrollTOTP,
        cancelEnrollment,
        verifyChallenge,
    };
};

export default useTwoFactor;
