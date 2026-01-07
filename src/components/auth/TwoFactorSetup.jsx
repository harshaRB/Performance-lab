import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Smartphone, Copy, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { colors, radius } from '../../styles/designSystem';
import { useTwoFactor } from '../../hooks/useTwoFactor';

/**
 * TwoFactorSetup Component
 * 
 * Modal for setting up Two-Factor Authentication.
 * Shows QR code, secret key, and verification input.
 */
const TwoFactorSetup = ({ isOpen, onClose, onSuccess }) => {
    const {
        enrollmentData,
        isLoading,
        error: _error,
        enrollTOTP,
        verifyTOTP,
        cancelEnrollment,
    } = useTwoFactor();

    const [step, setStep] = useState('intro'); // intro, scan, verify, success
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [verifyError, setVerifyError] = useState('');

    // Start enrollment when modal opens
    useEffect(() => {
        if (isOpen && step === 'intro') {
            // Reset state
            setCode('');
            setVerifyError('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleStartSetup = async () => {
        const result = await enrollTOTP();
        if (result.success) {
            setStep('scan');
        }
    };

    const handleCopySecret = () => {
        if (enrollmentData?.secret) {
            navigator.clipboard.writeText(enrollmentData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
            setStep('success');
            setTimeout(() => {
                onSuccess?.();
                onClose();
                setStep('intro');
            }, 2000);
        } else {
            setVerifyError(result.error || 'Invalid code. Please try again.');
        }
    };

    const handleClose = () => {
        if (step === 'scan' || step === 'verify') {
            cancelEnrollment();
        }
        setStep('intro');
        setCode('');
        setVerifyError('');
        onClose();
    };

    const styles = {
        overlay: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
        },
        modal: {
            width: '100%',
            maxWidth: '420px',
            background: colors.background.secondary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius['2xl'],
            overflow: 'hidden',
        },
        header: {
            padding: '1.5rem',
            borderBottom: `1px solid ${colors.border.subtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: '1.1rem',
            fontWeight: 700,
            color: colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            color: colors.text.muted,
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: radius.lg,
            display: 'flex',
        },
        body: {
            padding: '1.5rem',
        },
        qrContainer: {
            display: 'flex',
            justifyContent: 'center',
            padding: '1.5rem',
            background: '#fff',
            borderRadius: radius.xl,
            marginBottom: '1.5rem',
        },
        secretBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: radius.lg,
            marginBottom: '1.5rem',
        },
        secretText: {
            flex: 1,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: colors.text.secondary,
            wordBreak: 'break-all',
        },
        copyBtn: {
            background: 'none',
            border: 'none',
            color: colors.text.muted,
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
        },
        input: {
            width: '100%',
            padding: '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            color: colors.text.primary,
            fontSize: '1.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: 'center',
            letterSpacing: '0.5em',
            outline: 'none',
            marginBottom: '1rem',
        },
        button: {
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: radius.lg,
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
        },
        secondaryBtn: {
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            color: colors.text.muted,
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '0.75rem',
        },
        errorText: {
            color: colors.accent.danger,
            fontSize: '0.8rem',
            textAlign: 'center',
            marginBottom: '1rem',
        },
        successIcon: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
        },
        instruction: {
            fontSize: '0.85rem',
            color: colors.text.secondary,
            marginBottom: '1.5rem',
            lineHeight: 1.6,
        },
    };

    const renderContent = () => {
        switch (step) {
            case 'intro':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: radius.xl,
                                background: 'rgba(34, 197, 94, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                            }}>
                                <Smartphone size={28} color="#22c55e" />
                            </div>
                            <h3 style={{ color: colors.text.primary, marginBottom: '0.5rem' }}>
                                Set Up Authenticator
                            </h3>
                        </div>
                        <p style={styles.instruction}>
                            Two-factor authentication adds an extra layer of security by requiring
                            a code from your authenticator app when signing in.
                        </p>
                        <p style={{ ...styles.instruction, fontSize: '0.8rem' }}>
                            You&apos;ll need an authenticator app like Google Authenticator, Authy, or 1Password.
                        </p>
                        <button
                            style={styles.button}
                            onClick={handleStartSetup}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck size={18} />
                                    Begin Setup
                                </>
                            )}
                        </button>
                    </motion.div >
                );

            case 'scan':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p style={styles.instruction}>
                            Scan this QR code with your authenticator app:
                        </p>

                        {enrollmentData?.qrCode && (
                            <div style={styles.qrContainer}>
                                <img
                                    src={enrollmentData.qrCode}
                                    alt="2FA QR Code"
                                    style={{ width: '180px', height: '180px' }}
                                />
                            </div>
                        )}

                        <p style={{ ...styles.instruction, fontSize: '0.75rem' }}>
                            Or enter this code manually:
                        </p>

                        <div style={styles.secretBox}>
                            <span style={styles.secretText}>{enrollmentData?.secret}</span>
                            <button style={styles.copyBtn} onClick={handleCopySecret}>
                                {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                            </button>
                        </div>

                        <button
                            style={styles.button}
                            onClick={() => setStep('verify')}
                        >
                            Continue
                        </button>
                    </motion.div>
                );

            case 'verify':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p style={styles.instruction}>
                            Enter the 6-digit code from your authenticator app:
                        </p>

                        <input
                            type="text"
                            value={code}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setCode(val);
                                setVerifyError('');
                            }}
                            placeholder="000000"
                            style={styles.input}
                            autoFocus
                            maxLength={6}
                        />

                        {verifyError && (
                            <div style={styles.errorText}>
                                <AlertTriangle size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                {verifyError}
                            </div>
                        )}

                        <button
                            style={{ ...styles.button, opacity: code.length !== 6 ? 0.5 : 1 }}
                            onClick={handleVerify}
                            disabled={code.length !== 6 || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                'Verify & Enable'
                            )}
                        </button>

                        <button
                            style={styles.secondaryBtn}
                            onClick={() => setStep('scan')}
                        >
                            Back to QR Code
                        </button>
                    </motion.div>
                );

            case 'success':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center' }}
                    >
                        <motion.div
                            style={styles.successIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Check size={40} color="#22c55e" />
                        </motion.div>
                        <h3 style={{ color: colors.text.primary, marginBottom: '0.5rem' }}>
                            2FA Enabled!
                        </h3>
                        <p style={{ ...styles.instruction, marginBottom: 0 }}>
                            Your account is now protected with two-factor authentication.
                        </p>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        style={styles.modal}
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={styles.header}>
                            <div style={styles.title}>
                                <ShieldCheck size={20} color="#22c55e" />
                                Two-Factor Authentication
                            </div>
                            <button style={styles.closeBtn} onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>
                        <div style={styles.body}>
                            {renderContent()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TwoFactorSetup;
