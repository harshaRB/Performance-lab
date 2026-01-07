import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings as SettingsIcon, LogOut, Zap, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import PatternBackground from '../ui/PatternBackground';
import HexagonAvatar from '../ui/HexagonAvatar';
import { colors, typography, radius, animations } from '../../styles/designSystem';

// ============================================
// STYLES
// ============================================
const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: typography.fontFamily.primary,
        color: colors.text.secondary,
    },

    sidebar: {
        width: '260px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'rgba(15, 17, 21, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
    },

    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2.5rem',
        padding: '0 0.5rem',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: radius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
    },
    logoText: {
        fontSize: '1rem',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        color: colors.text.primary,
        letterSpacing: '-0.02em',
    },
    logoVersion: {
        fontSize: '0.6rem',
        color: colors.text.dim,
        fontFamily: "'JetBrains Mono', monospace",
    },

    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: radius.lg,
        color: colors.text.muted,
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: 500,
        fontFamily: "'JetBrains Mono', monospace",
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
    },
    navItemActive: {
        background: 'rgba(99,102,241,0.1)',
        color: colors.text.primary,
        borderColor: 'rgba(99,102,241,0.2)',
    },

    quickAddBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.875rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        border: 'none',
        borderRadius: radius.lg,
        color: colors.text.primary,
        fontSize: '0.8rem',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        marginTop: 'auto',
        marginBottom: '1rem',
        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
    },

    userSection: {
        padding: '1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: radius.lg,
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: colors.text.primary,
    },
    userPlan: {
        fontSize: '0.65rem',
        color: colors.text.dim,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase',
    },
    logoutBtn: {
        padding: '0.5rem',
        background: 'transparent',
        border: 'none',
        borderRadius: radius.md,
        color: colors.text.dim,
        cursor: 'pointer',
    },

    mainWrapper: {
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
    },

    header: {
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(5,5,5,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
    },

    // System Status Display
    statusDisplay: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    statusItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: '0.55rem',
        fontWeight: 700,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        fontFamily: "'JetBrains Mono', monospace",
    },
    statusValue: {
        fontSize: '1.75rem',
        fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace",
        color: colors.text.primary,
    },

    // Terminal-style ticker
    ticker: {
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        padding: '0.5rem 2rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    tickerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    tickerIcon: {
        color: '#22c55e',
    },
    tickerText: {
        fontSize: '0.7rem',
        color: colors.text.muted,
    },

    content: {
        flex: 1,
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
    },
};

// ============================================
// NAV ITEM COMPONENT
// ============================================
const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        style={({ isActive }) => ({
            ...styles.navItem,
            ...(isActive ? styles.navItemActive : {}),
        })}
    >
        {({ isActive }) => (
            <>
                <Icon size={18} color={isActive ? '#6366f1' : colors.text.muted} strokeWidth={1.5} />
                <span>{label}</span>
            </>
        )}
    </NavLink>
);

// ============================================
// SIDEBAR COMPONENT
// ============================================
const Sidebar = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    // Get user name from localStorage or email
    const profile = JSON.parse(localStorage.getItem('pl_user_profile') || '{}');
    const userName = profile.name || user?.email?.split('@')[0] || 'User';

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <aside style={styles.sidebar}>
            {/* Logo */}
            <div style={styles.logoWrapper}>
                <motion.div
                    style={styles.logoIcon}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <Terminal size={20} color="#fff" strokeWidth={1.5} />
                </motion.div>
                <div>
                    <div style={styles.logoText}>Vylos</div>
                    <div style={styles.logoVersion}>v2.0.0-beta</div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <NavItem to="/" icon={LayoutDashboard} label="DASHBOARD" />
                <NavItem to="/analytics" icon={Activity} label="ANALYTICS" />
                <NavItem to="/settings" icon={SettingsIcon} label="SETTINGS" />
            </nav>

            {/* Spacer to push user section to bottom */}
            <div style={{ flex: 1 }} />

            {/* User Section - Bottom */}
            <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: radius.lg,
                border: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                }}>
                    <HexagonAvatar name={userName} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: colors.text.primary,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {userName}
                        </div>
                        <div style={{
                            fontSize: '0.65rem',
                            color: colors.text.dim,
                            fontFamily: "'JetBrains Mono', monospace",
                            textTransform: 'uppercase',
                        }}>
                            FREE TIER
                        </div>
                    </div>
                </div>
                <motion.button
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'transparent',
                        border: `1px solid rgba(239, 68, 68, 0.3)`,
                        borderRadius: radius.md,
                        color: colors.text.muted,
                        fontSize: '0.7rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                    onClick={handleLogout}
                    whileHover={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                    <LogOut size={14} />
                    SIGN OUT
                </motion.button>
            </div>
        </aside>
    );
};

// ============================================
// HEADER COMPONENT  
// ============================================
const Header = () => {
    const { scores } = useAppStore();
    const _sysScore = Math.round(scores?.system || 0);
    const date = new Date();

    return (
        <header style={styles.header}>
            <div style={styles.headerContent}>
                {/* Date */}
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: colors.text.dim }}>
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>

                {/* Center spacer */}
                <div />

                {/* Time */}
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: colors.text.dim }}>
                    {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Terminal Ticker */}
            <div style={styles.ticker}>
                <div style={styles.tickerContent}>
                    <Zap size={12} style={styles.tickerIcon} />
                    <motion.span
                        style={styles.tickerText}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        SYSTEM ONLINE // AI COACH ACTIVE // TRACKING {Object.keys(scores || {}).length} METRICS
                    </motion.span>
                </div>
            </div>
        </header>
    );
};

// ============================================
// MAIN SHELL COMPONENT
// ============================================
export const AppShell = () => {
    return (
        <PatternBackground variant="tactical">
            <div style={styles.layout}>
                <Sidebar />
                <div style={styles.mainWrapper}>
                    <Header />
                    <motion.main
                        style={styles.content}
                        {...animations.pageEnter}
                    >
                        <Outlet />
                    </motion.main>
                </div>
            </div>
        </PatternBackground>
    );
};

export default AppShell;
