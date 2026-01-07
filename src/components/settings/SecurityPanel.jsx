import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, ShieldOff, Key, Smartphone, Copy, Check,
    Loader2, AlertTriangle, Download, Lock
} from 'lucide-react';
import { colors, radius } from '../../styles/designSystem';
import { useTwoFactor } from '../../hooks/useTwoFactor';
import { supabase } from '../../lib/supabaseClient';

/**
 * SecurityPanel Component
 * 
 * Comprehensive security settings panel with:
 * - 2FA enrollment and management
 * - Password change
 * - Data export
 */
const SecurityPanel = () => {
    const {
        isEnabled: is2FAEnabled,
        isLoading,
        enrollmentData,
        error: _error,
        enrollTOTP,
        verifyTOTP,
        unenrollTOTP,
        cancelEnrollment,
    } = useTwoFactor();

    const [step, setStep] = useState('idle'); // idle, enrolling, verifying
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [verifyError, setVerifyError] = useState('');

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleStartEnrollment = async () => {
        setStep('enrolling');
        setVerifyError('');
        const result = await enrollTOTP();
        if (!result.success) {
            setVerifyError(result.error || 'Failed to start enrollment');
            setStep('idle');
        }
    };

    const handleVerify = async () => {
        if (code.length !== 6) {
            setVerifyError('Please enter a 6-digit code');
            return;
        }

        setVerifyError('');
        const result = await verifyTOTP(code);

        if (result.success) {
            setStep('idle');
            setCode('');
        } else {
            setVerifyError(result.error || 'Invalid code. Please try again.');
        }
    };

    const handleDisable2FA = async () => {
        if (confirm('Are you sure you want to disable Two-Factor Authentication?')) {
            const result = await unenrollTOTP();
            if (!result.success) {
                alert('Failed to disable 2FA: ' + result.error);
            }
        }
    };

    const handleCancelEnrollment = () => {
        cancelEnrollment();
        setStep('idle');
        setCode('');
        setVerifyError('');
    };

    const handleCopySecret = () => {
        if (enrollmentData?.secret) {
            navigator.clipboard.writeText(enrollmentData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.new !== passwordForm.confirm) {
            setPasswordMessage('Passwords do not match');
            return;
        }
        if (passwordForm.new.length < 6) {
            setPasswordMessage('Password must be at least 6 characters');
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage('');

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.new
            });

            if (error) throw error;

            setPasswordMessage('Password updated successfully!');
            setPasswordForm({ current: '', new: '', confirm: '' });
            setTimeout(() => {
                setShowPasswordForm(false);
                setPasswordMessage('');
            }, 2000);
        } catch (err) {
            setPasswordMessage(err.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleExportData = () => {
        const data = {
            profile: JSON.parse(localStorage.getItem('pl_user_profile') || '{}'),
            nutritionDB: JSON.parse(localStorage.getItem('pl_nutrition_db') || '[]'),
            exerciseDB: JSON.parse(localStorage.getItem('exerciseDatabase') || '[]'),
            exportDate: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Vylos-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const styles = {
        container: {
            padding: '1.5rem',
            background: colors.background.tertiary,
            borderRadius: radius.xl,
        },
        section: {
            marginBottom: '1.5rem',
        },
        sectionTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
        },
        sectionLabel: {
            fontSize: '0.9rem',
            fontWeight: 600,
            color: colors.text.primary,
        },
        badge: {
            padding: '0.25rem 0.5rem',
            borderRadius: radius.full,
            fontSize: '0.65rem',
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
        },
        card: {
            padding: '1rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: radius.lg,
            marginBottom: '1rem',
        },
        qrContainer: {
            display: 'flex',
            justifyContent: 'center',
            padding: '1.5rem',
            background: '#fff',
            borderRadius: radius.lg,
            marginBottom: '1rem',
        },
        secretBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: radius.md,
            marginBottom: '1rem',
        },
        secretText: {
            flex: 1,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: colors.text.secondary,
            wordBreak: 'break-all',
        },
        input: {
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            color: colors.text.primary,
            fontSize: '0.9rem',
            outline: 'none',
            marginBottom: '0.75rem',
        },
        codeInput: {
            textAlign: 'center',
            fontSize: '1.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.5em',
        },
        button: {
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: radius.lg,
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
        },
        dangerButton: {
            background: 'transparent',
            border: `1px solid ${colors.accent.danger}40`,
            color: colors.accent.danger,
        },
        secondaryButton: {
            background: 'rgba(255,255,255,0.1)',
            border: `1px solid ${colors.border.default}`,
            color: colors.text.secondary,
        },
        errorText: {
            color: colors.accent.danger,
            fontSize: '0.8rem',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
        },
        successText: {
            color: '#22c55e',
            fontSize: '0.8rem',
            marginBottom: '0.75rem',
        },
        description: {
            fontSize: '0.8rem',
            color: colors.text.muted,
            marginBottom: '1rem',
            lineHeight: 1.5,
        },
    };

    return (
        <div style={styles.container}>
            {/* 2FA Section */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>
                    <ShieldCheck size={20} color={is2FAEnabled ? '#22c55e' : colors.text.dim} />
                    <span style={styles.sectionLabel}>Two-Factor Authentication</span>
                    {is2FAEnabled && (
                        <span style={{ ...styles.badge, background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                            ENABLED
                        </span>
                    )}
                </div>

                {is2FAEnabled ? (
                    // 2FA is enabled - show disable option
                    <div style={styles.card}>
                        <p style={styles.description}>
                            Your account is protected with two-factor authentication. You&apos;ll need your authenticator app to sign in.
                        </p>
                        <button
                            style={{ ...styles.button, ...styles.dangerButton }}
                            onClick={handleDisable2FA}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldOff size={16} />}
                            Disable 2FA
                        </button>
                    </div>
                ) : step === 'idle' ? (
                    // Not enrolled - show enroll option
                    <div style={styles.card}>
                        <p style={styles.description}>
                            Add an extra layer of security by requiring a code from your authenticator app when signing in.
                        </p>
                        <button
                            style={styles.button}
                            onClick={handleStartEnrollment}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={16} />}
                            Set Up 2FA
                        </button>
                    </div>
                ) : (
                    // Enrolling - show QR code and verification
                    <motion.div
                        style={styles.card}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p style={styles.description}>
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
                        </p>

                        {enrollmentData?.qrCode && (
                            <div style={styles.qrContainer}>
                                <img
                                    src={enrollmentData.qrCode}
                                    alt="2FA QR Code"
                                    style={{ width: '160px', height: '160px' }}
                                />
                            </div>
                        )}

                        <p style={{ ...styles.description, fontSize: '0.75rem' }}>
                            Or enter this code manually:
                        </p>

                        <div style={styles.secretBox}>
                            <Key size={14} color={colors.text.dim} />
                            <span style={styles.secretText}>{enrollmentData?.secret}</span>
                            <button
                                onClick={handleCopySecret}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                            >
                                {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} color={colors.text.muted} />}
                            </button>
                        </div>

                        <input
                            type="text"
                            value={code}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setCode(val);
                                setVerifyError('');
                            }}
                            placeholder="000000"
                            style={{ ...styles.input, ...styles.codeInput }}
                            maxLength={6}
                        />

                        {verifyError && (
                            <div style={styles.errorText}>
                                <AlertTriangle size={14} />
                                {verifyError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton, flex: 1 }}
                                onClick={handleCancelEnrollment}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ ...styles.button, flex: 2, opacity: code.length !== 6 ? 0.5 : 1 }}
                                onClick={handleVerify}
                                disabled={code.length !== 6 || isLoading}
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Enable'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Password Section */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>
                    <Lock size={20} color={colors.text.dim} />
                    <span style={styles.sectionLabel}>Password</span>
                </div>

                {!showPasswordForm ? (
                    <button
                        style={{ ...styles.button, ...styles.secondaryButton }}
                        onClick={() => setShowPasswordForm(true)}
                    >
                        Change Password
                    </button>
                ) : (
                    <motion.div
                        style={styles.card}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                            placeholder="New Password"
                            style={styles.input}
                        />
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                            placeholder="Confirm New Password"
                            style={styles.input}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={showPasswords}
                                onChange={() => setShowPasswords(!showPasswords)}
                                id="showPwd"
                            />
                            <label htmlFor="showPwd" style={{ fontSize: '0.8rem', color: colors.text.muted }}>
                                Show passwords
                            </label>
                        </div>

                        {passwordMessage && (
                            <div style={passwordMessage.includes('success') ? styles.successText : styles.errorText}>
                                {passwordMessage}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton, flex: 1 }}
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordForm({ current: '', new: '', confirm: '' });
                                    setPasswordMessage('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ ...styles.button, flex: 2, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                                onClick={handleChangePassword}
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Data Export Section */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>
                    <Download size={20} color={colors.text.dim} />
                    <span style={styles.sectionLabel}>Data Export</span>
                </div>
                <button
                    style={{ ...styles.button, ...styles.secondaryButton }}
                    onClick={handleExportData}
                >
                    <Download size={16} />
                    Export All Data
                </button>
            </div>
        </div>
    );
};

export default SecurityPanel;
