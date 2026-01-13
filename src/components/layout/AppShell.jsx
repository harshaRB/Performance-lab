import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings as SettingsIcon, LogOut, Zap, Terminal, Info, Ghost, Crosshair, Cpu, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import PatternBackground from '../ui/PatternBackground';
import HexagonAvatar from '../ui/HexagonAvatar';
import { colors, typography, radius, animations } from '../../styles/designSystem';

// ============================================
// MOBILE BREAKPOINT
// ============================================
const MOBILE_BREAKPOINT = 768;

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

    userSection: {
        padding: '1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: radius.lg,
        border: '1px solid rgba(255,255,255,0.05)',
    },

    mainWrapper: {
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
    },

    // Mobile specific
    mainWrapperMobile: {
        marginLeft: 0,
        paddingBottom: '80px', // Space for bottom nav
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
    headerContentMobile: {
        padding: '0 1rem',
        height: '56px',
    },

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
    contentMobile: {
        padding: '1rem',
    },

    // Bottom Navigation (Mobile)
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'rgba(15, 17, 21, 0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 1rem',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 100,
    },
    bottomNavItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
        color: colors.text.muted,
        textDecoration: 'none',
        minWidth: '60px',
        minHeight: '50px',
    },
    bottomNavLabel: {
        fontSize: '0.6rem',
        fontFamily: "'JetBrains Mono', monospace",
        marginTop: '0.25rem',
        letterSpacing: '0.05em',
    },

    // Mobile Drawer
    mobileOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
    },
    mobileDrawer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '280px',
        height: '100vh',
        background: 'rgba(15, 17, 21, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 201,
        overflowY: 'auto',
    },
    mobileMenuBtn: {
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        color: colors.text.primary,
        cursor: 'pointer',
        borderRadius: radius.md,
    },
};

// ============================================
// NAV ITEM COMPONENT (Desktop Sidebar)
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
// MOBILE BOTTOM NAV ITEM
// ============================================
const BottomNavItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to === '/' && location.pathname === '/');

    return (
        <NavLink to={to} style={{ ...styles.bottomNavItem }}>
            <motion.div
                animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                <Icon
                    size={22}
                    color={isActive ? '#6366f1' : colors.text.muted}
                    strokeWidth={isActive ? 2 : 1.5}
                />
            </motion.div>
            <motion.span
                style={{
                    ...styles.bottomNavLabel,
                    color: isActive ? '#6366f1' : colors.text.muted,
                    fontWeight: isActive ? 600 : 400,
                }}
                animate={{ opacity: isActive ? 1 : 0.6 }}
            >
                {label}
            </motion.span>
            {isActive && (
                <motion.div
                    layoutId="bottomNavIndicator"
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#6366f1',
                        boxShadow: '0 0 10px rgba(99,102,241,0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}
        </NavLink>
    );
};

// ============================================
// SIDEBAR COMPONENT (Desktop only)
// ============================================
const Sidebar = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const { isPro } = useSubscription();
    const { profile: storeProfile } = useAppStore();

    const localProfile = JSON.parse(localStorage.getItem('pl_user_profile') || '{}');
    const displayProfile = storeProfile.name ? storeProfile : localProfile;
    const userName = displayProfile.name || user?.email?.split('@')[0] || 'User';
    const avatarId = displayProfile.avatarId || 'operator';

    const getAvatarConfig = (id) => {
        switch (id) {
            case 'medic': return { icon: Activity, color: '#ef4444' };
            case 'tactician': return { icon: Crosshair, color: '#22c55e' };
            case 'ghost': return { icon: Ghost, color: '#9ca3af' };
            case 'engineer': return { icon: Cpu, color: '#f59e0b' };
            case 'speed': return { icon: Zap, color: '#eab308' };
            case 'operator':
            default: return { icon: Terminal, color: '#6366f1' };
        }
    };

    const avatarConfig = getAvatarConfig(avatarId);

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
                <NavItem to="/about" icon={Info} label="MANIFESTO" />
            </nav>

            <div style={{ flex: 1 }} />

            {/* User Section */}
            <div style={styles.userSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <HexagonAvatar
                        name={userName}
                        size={40}
                        icon={avatarConfig.icon}
                        color={avatarConfig.color}
                    />
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
                            {isPro ? 'PRO TIER' : 'FREE TIER'}
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
                    whileTap={{ scale: 0.98 }}
                >
                    <LogOut size={14} />
                    SIGN OUT
                </motion.button>
            </div>
        </aside>
    );
};

// ============================================
// MOBILE DRAWER COMPONENT
// ============================================
const MobileDrawer = ({ isOpen, onClose }) => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const { isPro } = useSubscription();
    const { profile: storeProfile } = useAppStore();

    const localProfile = JSON.parse(localStorage.getItem('pl_user_profile') || '{}');
    const displayProfile = storeProfile.name ? storeProfile : localProfile;
    const userName = displayProfile.name || user?.email?.split('@')[0] || 'User';

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
        onClose();
    };

    const handleNavClick = () => {
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        style={styles.mobileOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        style={styles.mobileDrawer}
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    >
                        {/* Close Button - More Prominent */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <span style={{
                                fontSize: '0.7rem',
                                color: colors.text.muted,
                                fontFamily: "'JetBrains Mono', monospace",
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>
                                MENU
                            </span>
                            <motion.button
                                style={{
                                    ...styles.mobileMenuBtn,
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: radius.md,
                                }}
                                onClick={onClose}
                                whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Logo */}
                        <div style={{ ...styles.logoWrapper, marginBottom: '2rem' }}>
                            <div style={styles.logoIcon}>
                                <Terminal size={20} color="#fff" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div style={styles.logoText}>Vylos</div>
                                <div style={styles.logoVersion}>v2.0.0-beta</div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav style={{ ...styles.nav, gap: '0.5rem' }} onClick={handleNavClick}>
                            <NavItem to="/" icon={LayoutDashboard} label="DASHBOARD" />
                            <NavItem to="/analytics" icon={Activity} label="ANALYTICS" />
                            <NavItem to="/settings" icon={SettingsIcon} label="SETTINGS" />
                            <NavItem to="/about" icon={Info} label="MANIFESTO" />
                        </nav>

                        <div style={{ flex: 1 }} />

                        {/* User Info */}
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: radius.lg }}>
                            <div style={{ fontSize: '0.85rem', color: colors.text.primary, marginBottom: '0.25rem' }}>
                                {userName}
                            </div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: isPro ? '#22c55e' : colors.text.dim,
                                fontFamily: "'JetBrains Mono', monospace",
                            }}>
                                {isPro ? 'PRO TIER' : 'FREE TIER'}
                            </div>
                        </div>

                        {/* Logout */}
                        <motion.button
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: radius.lg,
                                color: '#ef4444',
                                fontSize: '0.8rem',
                                fontFamily: "'JetBrains Mono', monospace",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                            onClick={handleLogout}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LogOut size={16} />
                            SIGN OUT
                        </motion.button>

                        {/* Hide Menu Button */}
                        <motion.button
                            style={{
                                marginTop: '0.75rem',
                                width: '100%',
                                padding: '0.875rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                borderRadius: radius.lg,
                                color: '#6366f1',
                                fontSize: '0.8rem',
                                fontFamily: "'JetBrains Mono', monospace",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                            onClick={onClose}
                            whileHover={{ background: 'rgba(99, 102, 241, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <X size={16} />
                            HIDE MENU
                        </motion.button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ============================================
// HEADER COMPONENT
// ============================================
const Header = ({ isMobile, onMenuOpen }) => {
    const { scores } = useAppStore();
    const date = new Date();

    return (
        <header style={styles.header}>
            <div style={{
                ...styles.headerContent,
                ...(isMobile ? styles.headerContentMobile : {}),
            }}>
                {/* Mobile Menu Button */}
                {isMobile && (
                    <motion.button
                        style={styles.mobileMenuBtn}
                        onClick={onMenuOpen}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Menu size={24} />
                    </motion.button>
                )}

                {/* Date */}
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    color: colors.text.dim,
                }}>
                    {date.toLocaleDateString('en-US', {
                        weekday: isMobile ? 'short' : 'long',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>

                <div />

                {/* Time */}
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    color: colors.text.dim,
                }}>
                    {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Terminal Ticker - Hidden on mobile */}
            {!isMobile && (
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
            )}
        </header>
    );
};

// ============================================
// BOTTOM NAVIGATION (Mobile)
// ============================================
const BottomNavigation = () => (
    <motion.nav
        style={styles.bottomNav}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
        <BottomNavItem to="/" icon={LayoutDashboard} label="HOME" />
        <BottomNavItem to="/analytics" icon={Activity} label="STATS" />
        <BottomNavItem to="/settings" icon={SettingsIcon} label="SETTINGS" />
        <BottomNavItem to="/about" icon={Info} label="INFO" />
    </motion.nav>
);

// ============================================
// MAIN SHELL COMPONENT
// ============================================
export const AppShell = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (!mobile) setDrawerOpen(false); // Close drawer when switching to desktop
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <PatternBackground variant="tactical">
            <div style={styles.layout}>
                {/* Desktop Sidebar */}
                {!isMobile && <Sidebar />}

                {/* Mobile Drawer */}
                <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

                {/* Main Content */}
                <div style={{
                    ...styles.mainWrapper,
                    ...(isMobile ? styles.mainWrapperMobile : {}),
                }}>
                    <Header isMobile={isMobile} onMenuOpen={() => setDrawerOpen(true)} />

                    <motion.main
                        style={{
                            ...styles.content,
                            ...(isMobile ? styles.contentMobile : {}),
                        }}
                        {...animations.pageEnter}
                    >
                        <Outlet />
                    </motion.main>
                </div>

                {/* Mobile Bottom Navigation */}
                {isMobile && <BottomNavigation />}
            </div>
        </PatternBackground>
    );
};

export default AppShell;
