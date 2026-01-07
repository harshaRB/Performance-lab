import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, AlertTriangle, X } from 'lucide-react';
import { colors, radius } from '../../styles/designSystem';
import { useTwoFactor } from '../../hooks/useTwoFactor';

/**
 * MFAChallengeModal Component
 * 
 * Modal that appears during login when user has 2FA enabled.
 * Prompts for 6-digit TOTP code to complete authentication.
 */
const MFAChallengeModal = ({
    isOpen,
    onClose,
    onSuccess,
    factorId,
}) => {
    const { verifyChallenge, isLoading } = useTwoFactor();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setError('');
        const result = await verifyChallenge(factorId, code);

        if (result.success) {
            setCode('');
            onSuccess?.();
        } else {
            setError(result.error || 'Invalid code. Please try again.');
        }
    };

    const handleClose = () => {
        setCode('');
        setError('');
        onClose?.();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && code.length === 6) {
            handleVerify();
        }
    };

    const styles = {
        overlay: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
        },
        modal: {
            width: '100%',
            maxWidth: '380px',
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
            fontSize: '1rem',
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
        description: {
            fontSize: '0.85rem',
            color: colors.text.secondary,
            marginBottom: '1.5rem',
            lineHeight: 1.5,
            textAlign: 'center',
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
        errorText: {
            color: colors.accent.danger,
            fontSize: '0.8rem',
            textAlign: 'center',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
        },
        iconWrapper: {
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        style={styles.modal}
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
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
                            <div style={styles.iconWrapper}>
                                <ShieldCheck size={32} color="#22c55e" />
                            </div>

                            <p style={styles.description}>
                                Enter the 6-digit code from your authenticator app to continue signing in.
                            </p>

                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setCode(val);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="000000"
                                style={styles.input}
                                autoFocus
                                maxLength={6}
                            />

                            {error && (
                                <div style={styles.errorText}>
                                    <AlertTriangle size={14} />
                                    {error}
                                </div>
                            )}

                            <button
                                style={{
                                    ...styles.button,
                                    opacity: code.length !== 6 || isLoading ? 0.5 : 1
                                }}
                                onClick={handleVerify}
                                disabled={code.length !== 6 || isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    'Verify'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MFAChallengeModal;
