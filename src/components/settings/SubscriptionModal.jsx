import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Check, X, CreditCard, Star, Loader2,
    Sparkles, TrendingUp, Download, HeadphonesIcon, Target, BarChart3
} from 'lucide-react';
import { colors, radius } from '../../styles/designSystem';
import { useSubscription } from '../../hooks/useSubscription';

/**
 * SubscriptionModal Component
 * 
 * Modal for upgrading to Pro tier.
 * Shows feature comparison and handles subscription flow.
 */
const SubscriptionModal = ({ isOpen, onClose, onSuccess }) => {
    const { subscribe, isLoading, isDemo } = useSubscription();
    const [step, setStep] = useState('compare'); // compare, processing, success
    const [error, setError] = useState('');

    const handleUpgrade = async () => {
        setStep('processing');
        setError('');

        const result = await subscribe('pro');

        if (result.success) {
            setStep('success');
            setTimeout(() => {
                onSuccess?.();
                onClose();
                setStep('compare');
            }, 2500);
        } else {
            setError(result.error || 'Something went wrong. Please try again.');
            setStep('compare');
        }
    };

    const handleClose = () => {
        setStep('compare');
        setError('');
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
            maxWidth: '480px',
            background: colors.background.secondary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius['2xl'],
            overflow: 'hidden',
        },
        header: {
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            borderBottom: `1px solid ${colors.border.subtle}`,
            textAlign: 'center',
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: radius.full,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '1rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 800,
            color: colors.text.primary,
            marginBottom: '0.5rem',
        },
        subtitle: {
            fontSize: '0.9rem',
            color: colors.text.muted,
        },
        body: {
            padding: '1.5rem',
        },
        priceBox: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '0.25rem',
            marginBottom: '1.5rem',
        },
        priceAmount: {
            fontSize: '3rem',
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            color: colors.text.primary,
        },
        pricePeriod: {
            fontSize: '1rem',
            color: colors.text.muted,
        },
        featureList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.5rem',
        },
        featureItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem',
            color: colors.text.secondary,
        },
        featureIcon: {
            width: '24px',
            height: '24px',
            borderRadius: radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        button: {
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: radius.lg,
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
        },
        cancelBtn: {
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: 'none',
            color: colors.text.muted,
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '0.75rem',
        },
        demoNote: {
            fontSize: '0.7rem',
            color: colors.text.dim,
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: radius.lg,
        },
        errorText: {
            color: colors.accent.danger,
            fontSize: '0.8rem',
            textAlign: 'center',
            marginBottom: '1rem',
        },
        successIcon: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
        },
        processingText: {
            fontSize: '0.9rem',
            color: colors.text.muted,
            textAlign: 'center',
        },
    };

    const proFeatures = [
        { icon: Sparkles, color: '#8b5cf6', text: 'Advanced AI Coach insights' },
        { icon: TrendingUp, color: '#22c55e', text: 'Unlimited data history' },
        { icon: BarChart3, color: '#3b82f6', text: 'Correlation analysis' },
        { icon: Target, color: '#f59e0b', text: 'Custom goals & targets' },
        { icon: Download, color: '#06b6d4', text: 'Export to CSV/PDF' },
        { icon: HeadphonesIcon, color: '#ec4899', text: 'Priority support' },
    ];

    const renderContent = () => {
        switch (step) {
            case 'compare':
                return (
                    <>
                        <div style={styles.header}>
                            <div style={styles.badge}>
                                <Star size={14} />
                                UPGRADE
                            </div>
                            <h2 style={styles.title}>Go Pro</h2>
                            <p style={styles.subtitle}>Unlock your full potential</p>
                        </div>
                        <div style={styles.body}>
                            <div style={styles.priceBox}>
                                <span style={{ fontSize: '1.5rem', color: colors.text.muted }}>₹</span>
                                <span style={styles.priceAmount}>499</span>
                                <span style={styles.pricePeriod}>/month</span>
                            </div>

                            <div style={styles.featureList}>
                                {proFeatures.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        style={styles.featureItem}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div style={{ ...styles.featureIcon, background: `${feature.color}20` }}>
                                            <feature.icon size={14} color={feature.color} />
                                        </div>
                                        {feature.text}
                                    </motion.div>
                                ))}
                            </div>

                            {error && <div style={styles.errorText}>{error}</div>}

                            <motion.button
                                style={styles.button}
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CreditCard size={18} />
                                Upgrade to Pro
                            </motion.button>

                            <button style={styles.cancelBtn} onClick={handleClose}>
                                Maybe later
                            </button>

                            {isDemo && (
                                <div style={styles.demoNote}>
                                    <Zap size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Demo Mode: No real payment will be processed
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'processing':
                return (
                    <div style={{ ...styles.body, padding: '3rem 1.5rem', textAlign: 'center' }}>
                        <motion.div
                            style={styles.successIcon}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        >
                            <Loader2 size={40} color="#6366f1" />
                        </motion.div>
                        <h3 style={{ color: colors.text.primary, marginBottom: '0.5rem' }}>
                            Processing...
                        </h3>
                        <p style={styles.processingText}>
                            {isDemo ? 'Activating your Pro subscription...' : 'Connecting to payment provider...'}
                        </p>
                    </div>
                );

            case 'success':
                return (
                    <motion.div
                        style={{ ...styles.body, padding: '3rem 1.5rem', textAlign: 'center' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <motion.div
                            style={{
                                ...styles.successIcon,
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Check size={48} color="#22c55e" />
                            </motion.div>
                        </motion.div>
                        <h3 style={{ color: colors.text.primary, marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                            Welcome to Pro! 🎉
                        </h3>
                        <p style={styles.processingText}>
                            You now have access to all premium features.
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
                        {step !== 'compare' && (
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: colors.text.muted,
                                    cursor: 'pointer',
                                    zIndex: 10,
                                }}
                                onClick={handleClose}
                            >
                                <X size={20} />
                            </button>
                        )}
                        {renderContent()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SubscriptionModal;
