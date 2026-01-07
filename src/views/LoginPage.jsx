import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Inline styles to guarantee rendering
const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
    },
    // Animated background orbs
    orb1: {
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '-200px',
        left: '-200px',
        filter: 'blur(60px)',
    },
    orb2: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        bottom: '-150px',
        right: '-150px',
        filter: 'blur(80px)',
    },
    // Grid pattern overlay
    grid: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
    },
    // Glass card
    card: {
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(15, 17, 21, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    },
    // Logo container
    logoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
    },
    logo: {
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(99,102,241,0.4)',
    },
    // Header
    title: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: '2rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    // Input group
    inputGroup: {
        marginBottom: '1.25rem',
    },
    inputLabel: {
        display: 'block',
        fontSize: '0.7rem',
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: "'JetBrains Mono', monospace",
    },
    inputIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#6b7280',
    },
    // Button
    button: {
        width: '100%',
        padding: '1rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        border: 'none',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        cursor: 'pointer',
        marginTop: '1.5rem',
        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
        transition: 'all 0.3s ease',
    },
    buttonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 40px rgba(99,102,241,0.5)',
    },
    // Error
    error: {
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '1rem',
        color: '#fca5a5',
        fontSize: '0.8rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    // Footer
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#6b7280',
    },
    link: {
        color: '#818cf8',
        textDecoration: 'none',
        fontWeight: '600',
        marginLeft: '0.5rem',
    },
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { signIn, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await signIn(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.page}>
            {/* Animated Background */}
            <motion.div
                style={styles.orb1}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                style={styles.orb2}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <div style={styles.grid} />

            {/* Card */}
            <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Logo */}
                <div style={styles.logoWrapper}>
                    <motion.div
                        style={styles.logo}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Zap size={28} color="#fff" fill="#fff" />
                    </motion.div>
                </div>

                {/* Header */}
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>AUTHENTICATE // Vylos_LABS</p>

                {/* Error */}
                {error && (
                    <motion.div
                        style={styles.error}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        ⚠ {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Email Address</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.inputIcon} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="agent@example.com"
                                style={styles.input}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#6366f1';
                                    e.target.style.boxShadow = '0 0 15px rgba(99,102,241,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.inputIcon} />
                            <style>
                                {/* Hide native password eye in Edge/IE */}
                                {`
                                    input::-ms-reveal,
                                    input::-ms-clear {
                                        display: none;
                                    }
                                `}
                            </style>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                style={{ ...styles.input, paddingRight: '4rem' }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#6366f1';
                                    e.target.style.boxShadow = '0 0 15px rgba(99,102,241,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    padding: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isHovered ? styles.buttonHover : {})
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? '⟳ Authenticating...' : 'Sign In'}
                    </motion.button>
                </form>

                {/* Footer */}
                <div style={styles.footer}>
                    <span>New to Vylos Labs?</span>
                    <Link to="/signup" style={styles.link}>Create Account →</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
