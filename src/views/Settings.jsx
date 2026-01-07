import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Bell, Shield, LogOut, ChevronRight, ChevronDown, Moon, Sun, Zap,
    FileText, Scale, Cookie, Trash2, ScrollText,
    CreditCard, Star, Check, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { colors, typography, radius, animations } from '../styles/designSystem';
import { useTwoFactor } from '../hooks/useTwoFactor';
import { useSubscription } from '../hooks/useSubscription';
import TwoFactorSetup from '../components/auth/TwoFactorSetup';
import SubscriptionModal from '../components/settings/SubscriptionModal';

// ============================================
// STYLES
// ============================================
const styles = {
    container: {
        width: '100%',
        maxWidth: '700px',
    },

    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.muted,
    },

    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        marginBottom: '1rem',
        paddingLeft: '0.5rem',
    },

    card: {
        background: colors.background.secondary,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.xl,
        overflow: 'hidden',
    },

    row: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        borderBottom: `1px solid ${colors.border.subtle}`,
        cursor: 'pointer',
        transition: 'background 0.2s ease',
    },
    rowLast: {
        borderBottom: 'none',
    },
    rowIcon: {
        width: '40px',
        height: '40px',
        borderRadius: radius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
    },
    rowContent: {
        flex: 1,
    },
    rowLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: '0.125rem',
    },
    rowDescription: {
        fontSize: typography.fontSize.xs,
        color: colors.text.muted,
    },

    toggle: {
        width: '48px',
        height: '26px',
        borderRadius: '13px',
        background: colors.background.tertiary,
        border: `1px solid ${colors.border.default}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    toggleActive: {
        background: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    toggleKnob: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: colors.text.primary,
        transition: 'transform 0.3s ease',
    },
    toggleKnobActive: {
        transform: 'translateX(22px)',
    },

    panel: {
        padding: '1.25rem',
        background: colors.background.tertiary,
        borderTop: `1px solid ${colors.border.subtle}`,
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.7rem',
        fontWeight: '600',
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.lg,
        color: colors.text.primary,
        fontSize: typography.fontSize.sm,
        outline: 'none',
    },
    button: {
        padding: '0.75rem 1.5rem',
        background: colors.brand.primary,
        border: 'none',
        borderRadius: radius.lg,
        color: colors.text.primary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        cursor: 'pointer',
        marginTop: '0.5rem',
    },

    badge: {
        padding: '0.25rem 0.5rem',
        borderRadius: radius.full,
        fontSize: '0.65rem',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
    },

    dangerBtn: {
        width: '100%',
        padding: '1rem',
        background: 'transparent',
        border: `1px solid ${colors.accent.danger}40`,
        borderRadius: radius.lg,
        color: colors.accent.danger,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s ease',
    },
};

// ============================================
// LEGAL PAGE MODAL
// ============================================
const LegalModal = ({ isOpen, onClose, title, content }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        background: colors.background.secondary,
                        border: `1px solid ${colors.border.default}`,
                        borderRadius: radius['2xl'],
                        overflow: 'hidden',
                    }}
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: `1px solid ${colors.border.subtle}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.text.primary }}>{title}</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: colors.text.muted, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                    </div>
                    <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '60vh', fontSize: '0.85rem', color: colors.text.secondary, lineHeight: 1.7 }}>
                        {content}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// ============================================
// SETTINGS PAGE COMPONENT
// ============================================
const Settings = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [expandedSection, setExpandedSection] = useState(null);
    const [activeLegal, setActiveLegal] = useState(null);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('pl_user_profile');
        return saved ? JSON.parse(saved) : { name: '', email: '', age: '', weight: '', height: '' };
    });

    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState(false);

    const { signOut, user } = useAuth();
    const { isEnabled: twoFactorEnabled, unenrollTOTP, isLoading: is2FALoading } = useTwoFactor();
    const { isPro, subscription, isDemo } = useSubscription();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email && !profile.email) {
            setProfile(prev => ({ ...prev, email: user.email }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, profile.email]);

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            await signOut();
            navigate('/login');
        }
    };

    const saveProfile = () => {
        localStorage.setItem('pl_user_profile', JSON.stringify(profile));
        alert('Profile saved!');
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Legal content
    const legalContent = {
        privacy: (
            <div>
                <h3 style={{ marginBottom: '1rem', color: colors.text.primary }}>Privacy Policy</h3>
                <p><strong>Last Updated:</strong> January 2026</p>
                <br />
                <p>Vylos Labs (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Data We Collect</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Health metrics (sleep, nutrition, training data)</li>
                    <li>Account information (email, name)</li>
                    <li>Device and usage data</li>
                </ul>
                <br />
                <h4 style={{ color: colors.text.primary }}>How We Use Your Data</h4>
                <p>Your data is used solely to provide personalized health insights. We never sell your data to third parties.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Your Rights (GDPR/CCPA)</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Right to access your data</li>
                    <li>Right to data portability</li>
                    <li>Right to deletion</li>
                    <li>Right to opt-out of data collection</li>
                </ul>
            </div>
        ),
        terms: (
            <div>
                <h3 style={{ marginBottom: '1rem', color: colors.text.primary }}>Terms of Service</h3>
                <p><strong>Effective Date:</strong> January 2026</p>
                <br />
                <p>By using Vylos Labs, you agree to these terms. Please read carefully.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Use of Service</h4>
                <p>You must be 18+ to use this app. You agree to provide accurate information and use the service responsibly.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Intellectual Property</h4>
                <p>All content, features, and functionality are owned by Vylos Labs and protected by copyright laws.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Limitation of Liability</h4>
                <p>Vylos Labs is provided &quot;as is&quot; without warranties. We are not liable for any health decisions made based on app data.</p>
            </div>
        ),
        medical: (
            <div>
                <h3 style={{ marginBottom: '1rem', color: colors.accent.danger }}>⚠️ Medical Disclaimer</h3>
                <br />
                <p style={{ fontSize: '1rem', fontWeight: 600, color: colors.text.primary }}>
                    Vylos Labs is NOT a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <br />
                <p>The health metrics, scores, and recommendations provided by this app are for informational and educational purposes only.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Important Notices:</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Always consult a qualified healthcare provider before making health decisions</li>
                    <li>Do not disregard professional medical advice based on app information</li>
                    <li>Seek immediate medical attention for health emergencies</li>
                    <li>Individual results may vary; what works for others may not work for you</li>
                </ul>
                <br />
                <p>By using this app, you acknowledge and accept this disclaimer.</p>
            </div>
        ),
        cookies: (
            <div>
                <h3 style={{ marginBottom: '1rem', color: colors.text.primary }}>Cookie Policy</h3>
                <p>We use cookies and similar technologies to enhance your experience.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Types of Cookies</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li><strong>Essential:</strong> Required for app functionality</li>
                    <li><strong>Authentication:</strong> Keep you logged in</li>
                    <li><strong>Analytics:</strong> Help us improve the app</li>
                </ul>
                <br />
                <p>You can disable cookies in your browser settings, but some features may not work properly.</p>
            </div>
        ),
        deletion: (
            <div>
                <h3 style={{ marginBottom: '1rem', color: colors.text.primary }}>Data Deletion Policy</h3>
                <p>You have the right to request complete deletion of your data at any time.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>How to Request Deletion</h4>
                <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Go to Settings → Privacy & Security</li>
                    <li>Click &quot;Export All Data&quot; (recommended backup)</li>
                    <li>Contact support@Vyloslabs.app with deletion request</li>
                </ol>
                <br />
                <h4 style={{ color: colors.text.primary }}>What Gets Deleted</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>All profile information</li>
                    <li>All health metrics and logs</li>
                    <li>All custom databases (nutrition, exercises)</li>
                    <li>Account credentials</li>
                </ul>
                <br />
                <p>Deletion is permanent and cannot be undone. Processing takes up to 30 days.</p>
            </div>
        ),
        eula: (
            <div>
                <h3 style={{ marginBottom: '1rem', color: colors.text.primary }}>End User License Agreement (EULA)</h3>
                <p>This agreement grants you a limited, non-exclusive license to use Vylos Labs.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>License Grant</h4>
                <p>You may install and use the app on devices you own for personal, non-commercial use.</p>
                <br />
                <h4 style={{ color: colors.text.primary }}>Restrictions</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Do not reverse engineer or decompile the app</li>
                    <li>Do not redistribute or resell the app</li>
                    <li>Do not use for illegal purposes</li>
                </ul>
                <br />
                <h4 style={{ color: colors.text.primary }}>Termination</h4>
                <p>This license terminates if you violate any terms. Upon termination, you must delete all copies.</p>
            </div>
        ),
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <motion.div style={styles.header} {...animations.slideUp}>
                <h1 style={styles.title}>Settings</h1>
                <p style={styles.subtitle}>Manage your account, security, and preferences</p>
            </motion.div>

            {/* Subscription Section */}
            <motion.div
                style={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <div style={styles.sectionTitle}>Subscription</div>
                <div style={{
                    background: isPro
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                    border: `1px solid ${isPro ? 'rgba(34, 197, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                    borderRadius: radius.xl,
                    padding: '1.5rem',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.text.primary }}>
                                    {isPro ? 'Pro Tier' : 'Free Tier'}
                                </span>
                                <span style={{
                                    ...styles.badge,
                                    background: isPro ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                                    color: isPro ? '#22c55e' : colors.text.muted
                                }}>
                                    {isPro ? 'ACTIVE' : 'CURRENT'}
                                </span>
                                {isDemo && isPro && (
                                    <span style={{ ...styles.badge, background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>DEMO</span>
                                )}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: colors.text.muted }}>
                                {isPro ? 'Full access to all features' : 'Basic tracking and insights'}
                            </p>
                            {isPro && subscription?.expiresAt && (
                                <p style={{ fontSize: '0.7rem', color: colors.text.dim, marginTop: '0.25rem' }}>
                                    Renews: {new Date(subscription.expiresAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <Star size={24} color={isPro ? '#22c55e' : colors.text.dim} fill={isPro ? '#22c55e' : 'none'} />
                    </div>

                    {!isPro && (
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: radius.lg,
                            padding: '1rem',
                            marginBottom: '1rem',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Zap size={16} color="#f59e0b" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text.primary }}>Upgrade to Pro</span>
                            </div>
                            <ul style={{ fontSize: '0.75rem', color: colors.text.secondary, marginLeft: '1.5rem', lineHeight: 1.8 }}>
                                <li>Advanced AI Coach insights</li>
                                <li>Unlimited data history</li>
                                <li>Priority support</li>
                                <li>Export to CSV/PDF</li>
                            </ul>
                        </div>
                    )}

                    <button
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: isPro
                                ? 'rgba(255,255,255,0.1)'
                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            border: isPro ? `1px solid ${colors.border.default}` : 'none',
                            borderRadius: radius.lg,
                            color: '#fff',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease',
                        }}
                        onClick={() => !isPro && setShowSubscriptionModal(true)}
                    >
                        {isPro ? (
                            <>
                                <Check size={16} />
                                Pro Member
                            </>
                        ) : (
                            <>
                                <CreditCard size={16} />
                                Upgrade - ₹499/mo
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Account Section */}
            <motion.div
                style={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div style={styles.sectionTitle}>Account</div>
                <div style={styles.card}>
                    {/* Profile */}
                    <div>
                        <motion.div
                            style={styles.row}
                            onClick={() => toggleSection('profile')}
                            whileHover={{ background: colors.background.tertiary }}
                        >
                            <div style={{ ...styles.rowIcon, background: `${colors.brand.primary}20` }}>
                                <User size={20} color={colors.text.primary} />
                            </div>
                            <div style={styles.rowContent}>
                                <div style={styles.rowLabel}>Profile</div>
                                <div style={styles.rowDescription}>Manage your personal information</div>
                            </div>
                            {expandedSection === 'profile' ?
                                <ChevronDown size={18} color={colors.text.dim} /> :
                                <ChevronRight size={18} color={colors.text.dim} />
                            }
                        </motion.div>

                        <AnimatePresence>
                            {expandedSection === 'profile' && (
                                <motion.div
                                    style={styles.panel}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Full Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                                placeholder="Your name"
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                                placeholder="email@example.com"
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Age</label>
                                            <input
                                                type="number"
                                                value={profile.age}
                                                onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                                                placeholder="25"
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Weight (kg)</label>
                                            <input
                                                type="number"
                                                value={profile.weight}
                                                onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
                                                placeholder="70"
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={saveProfile} style={styles.button}>Save Profile</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Privacy & Security */}
                    <div>
                        <motion.div
                            style={{ ...styles.row, ...styles.rowLast }}
                            onClick={() => toggleSection('security')}
                            whileHover={{ background: colors.background.tertiary }}
                        >
                            <div style={{ ...styles.rowIcon, background: `${colors.accent.success}20` }}>
                                <Shield size={20} color={colors.text.primary} />
                            </div>
                            <div style={styles.rowContent}>
                                <div style={styles.rowLabel}>Privacy & Security</div>
                                <div style={styles.rowDescription}>Password, 2FA, and data settings</div>
                            </div>
                            {expandedSection === 'security' ?
                                <ChevronDown size={18} color={colors.text.dim} /> :
                                <ChevronRight size={18} color={colors.text.dim} />
                            }
                        </motion.div>

                        <AnimatePresence>
                            {expandedSection === 'security' && (
                                <motion.div
                                    style={styles.panel}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Two-Factor Authentication */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem',
                                        background: twoFactorEnabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0,0,0,0.2)',
                                        borderRadius: radius.lg,
                                        marginBottom: '1rem',
                                        border: twoFactorEnabled ? '1px solid rgba(34, 197, 94, 0.2)' : 'none',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <ShieldCheck size={20} color={twoFactorEnabled ? '#22c55e' : colors.text.dim} />
                                            <div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text.primary }}>Two-Factor Authentication</div>
                                                <div style={{ fontSize: '0.7rem', color: colors.text.muted }}>
                                                    {twoFactorEnabled ? 'Your account is protected' : 'Add an extra layer of security'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {twoFactorEnabled && (
                                                <span style={{ ...styles.badge, background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>ENABLED</span>
                                            )}
                                            <div
                                                style={{
                                                    ...styles.toggle,
                                                    ...(twoFactorEnabled ? styles.toggleActive : {}),
                                                    opacity: is2FALoading ? 0.5 : 1,
                                                    cursor: is2FALoading ? 'wait' : 'pointer',
                                                }}
                                                onClick={async () => {
                                                    if (is2FALoading) return;
                                                    if (twoFactorEnabled) {
                                                        if (confirm('Are you sure you want to disable Two-Factor Authentication?')) {
                                                            await unenrollTOTP();
                                                        }
                                                    } else {
                                                        setShow2FAModal(true);
                                                    }
                                                }}
                                            >
                                                <div style={{ ...styles.toggleKnob, ...(twoFactorEnabled ? styles.toggleKnobActive : {}) }} />
                                            </div>
                                        </div>
                                    </div>

                                    <h4 style={{ ...styles.label, marginBottom: '1rem', fontSize: '0.8rem' }}>Change Password</h4>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Current Password</label>
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={passwordForm.current}
                                            onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                                            placeholder="••••••••"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>New Password</label>
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={passwordForm.new}
                                            onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                                            placeholder="••••••••"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={showPasswords}
                                            onChange={() => setShowPasswords(!showPasswords)}
                                            id="showPwd"
                                        />
                                        <label htmlFor="showPwd" style={{ fontSize: '0.8rem', color: colors.text.muted }}>Show passwords</label>
                                    </div>
                                    <button style={styles.button}>Update Password</button>

                                    <hr style={{ border: 'none', borderTop: `1px solid ${colors.border.subtle}`, margin: '1.5rem 0' }} />

                                    <button
                                        onClick={() => {
                                            const data = {
                                                profile: JSON.parse(localStorage.getItem('pl_user_profile') || '{}'),
                                                nutritionDB: JSON.parse(localStorage.getItem('pl_nutrition_db') || '[]'),
                                                exerciseDB: JSON.parse(localStorage.getItem('exerciseDatabase') || '[]'),
                                            };
                                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `performance-lab-backup-${new Date().toISOString().split('T')[0]}.json`;
                                            a.click();
                                        }}
                                        style={{ ...styles.button, background: colors.accent.info }}
                                    >
                                        Export All Data
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Preferences Section */}
            <motion.div
                style={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div style={styles.sectionTitle}>Preferences</div>
                <div style={styles.card}>
                    <motion.div
                        style={styles.row}
                        onClick={() => setDarkMode(!darkMode)}
                        whileHover={{ background: colors.background.tertiary }}
                    >
                        <div style={{ ...styles.rowIcon, background: `${colors.brand.secondary}20` }}>
                            {darkMode ? <Moon size={20} color={colors.text.primary} /> : <Sun size={20} color={colors.text.primary} />}
                        </div>
                        <div style={styles.rowContent}>
                            <div style={styles.rowLabel}>Dark Mode</div>
                            <div style={styles.rowDescription}>Use dark theme</div>
                        </div>
                        <div style={{ ...styles.toggle, ...(darkMode ? styles.toggleActive : {}) }}>
                            <div style={{ ...styles.toggleKnob, ...(darkMode ? styles.toggleKnobActive : {}) }} />
                        </div>
                    </motion.div>
                    <motion.div
                        style={{ ...styles.row, ...styles.rowLast }}
                        onClick={() => setNotifications(!notifications)}
                        whileHover={{ background: colors.background.tertiary }}
                    >
                        <div style={{ ...styles.rowIcon, background: `${colors.accent.warning}20` }}>
                            <Bell size={20} color={colors.text.primary} />
                        </div>
                        <div style={styles.rowContent}>
                            <div style={styles.rowLabel}>Notifications</div>
                            <div style={styles.rowDescription}>Push and email notifications</div>
                        </div>
                        <div style={{ ...styles.toggle, ...(notifications ? styles.toggleActive : {}) }}>
                            <div style={{ ...styles.toggleKnob, ...(notifications ? styles.toggleKnobActive : {}) }} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Legal Section */}
            <motion.div
                style={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div style={styles.sectionTitle}>Legal & Compliance</div>
                <div style={styles.card}>
                    <motion.div style={styles.row} onClick={() => setActiveLegal('privacy')} whileHover={{ background: colors.background.tertiary }}>
                        <div style={{ ...styles.rowIcon, background: 'rgba(59, 130, 246, 0.1)' }}><FileText size={20} color="#3b82f6" /></div>
                        <div style={styles.rowContent}><div style={styles.rowLabel}>Privacy Policy</div><div style={styles.rowDescription}>How we handle your data</div></div>
                        <ChevronRight size={18} color={colors.text.dim} />
                    </motion.div>
                    <motion.div style={styles.row} onClick={() => setActiveLegal('terms')} whileHover={{ background: colors.background.tertiary }}>
                        <div style={{ ...styles.rowIcon, background: 'rgba(139, 92, 246, 0.1)' }}><Scale size={20} color="#8b5cf6" /></div>
                        <div style={styles.rowContent}><div style={styles.rowLabel}>Terms of Service</div><div style={styles.rowDescription}>Usage terms and conditions</div></div>
                        <ChevronRight size={18} color={colors.text.dim} />
                    </motion.div>
                    <motion.div style={styles.row} onClick={() => setActiveLegal('medical')} whileHover={{ background: colors.background.tertiary }}>
                        <div style={{ ...styles.rowIcon, background: 'rgba(239, 68, 68, 0.1)' }}><Shield size={20} color="#ef4444" /></div>
                        <div style={styles.rowContent}><div style={styles.rowLabel}>Medical Disclaimer</div><div style={styles.rowDescription}>Not a substitute for medical advice</div></div>
                        <ChevronRight size={18} color={colors.text.dim} />
                    </motion.div>
                    <motion.div style={styles.row} onClick={() => setActiveLegal('cookies')} whileHover={{ background: colors.background.tertiary }}>
                        <div style={{ ...styles.rowIcon, background: 'rgba(245, 158, 11, 0.1)' }}><Cookie size={20} color="#f59e0b" /></div>
                        <div style={styles.rowContent}><div style={styles.rowLabel}>Cookie Policy</div><div style={styles.rowDescription}>How we use cookies</div></div>
                        <ChevronRight size={18} color={colors.text.dim} />
                    </motion.div>
                    <motion.div style={styles.row} onClick={() => setActiveLegal('deletion')} whileHover={{ background: colors.background.tertiary }}>
                        <div style={{ ...styles.rowIcon, background: 'rgba(34, 197, 94, 0.1)' }}><Trash2 size={20} color="#22c55e" /></div>
                        <div style={styles.rowContent}><div style={styles.rowLabel}>Data Deletion Policy</div><div style={styles.rowDescription}>How to request data removal</div></div>
                        <ChevronRight size={18} color={colors.text.dim} />
                    </motion.div>
                    <motion.div style={{ ...styles.row, ...styles.rowLast }} onClick={() => setActiveLegal('eula')} whileHover={{ background: colors.background.tertiary }}>
                        <div style={{ ...styles.rowIcon, background: 'rgba(6, 182, 212, 0.1)' }}><ScrollText size={20} color="#06b6d4" /></div>
                        <div style={styles.rowContent}><div style={styles.rowLabel}>EULA</div><div style={styles.rowDescription}>End User License Agreement</div></div>
                        <ChevronRight size={18} color={colors.text.dim} />
                    </motion.div>
                </div>
            </motion.div>

            {/* App Info */}
            <motion.div
                style={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                <div style={styles.sectionTitle}>App</div>
                <div style={styles.card}>
                    <div style={{ ...styles.row, ...styles.rowLast, cursor: 'default' }}>
                        <div style={{ ...styles.rowIcon, background: `${colors.modules.training}20` }}>
                            <Zap size={20} color={colors.text.primary} />
                        </div>
                        <div style={styles.rowContent}>
                            <div style={styles.rowLabel}>Vylos Labs</div>
                            <div style={styles.rowDescription}>Version 2.0.0</div>
                        </div>
                        <span style={{ ...styles.badge, background: `${colors.brand.primary}20`, color: colors.brand.primary }}>Beta</span>
                    </div>
                </div>
            </motion.div>

            {/* Logout */}
            <motion.div
                style={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <motion.button
                    style={styles.dangerBtn}
                    onClick={handleLogout}
                    whileHover={{ background: `${colors.accent.danger}10`, borderColor: colors.accent.danger }}
                    whileTap={{ scale: 0.98 }}
                >
                    <LogOut size={18} />
                    Log Out
                </motion.button>
            </motion.div>

            {/* Legal Modal */}
            <LegalModal
                isOpen={activeLegal !== null}
                onClose={() => setActiveLegal(null)}
                title={activeLegal ? {
                    privacy: 'Privacy Policy',
                    terms: 'Terms of Service',
                    medical: 'Medical Disclaimer',
                    cookies: 'Cookie Policy',
                    deletion: 'Data Deletion Policy',
                    eula: 'EULA',
                }[activeLegal] : ''}
                content={activeLegal ? legalContent[activeLegal] : null}
            />

            {/* Two-Factor Setup Modal */}
            <TwoFactorSetup
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onSuccess={() => setShow2FAModal(false)}
            />

            {/* Subscription Modal */}
            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                onSuccess={() => setShowSubscriptionModal(false)}
            />
        </div>
    );
};

export default Settings;
