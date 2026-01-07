import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { colors, typography, radius } from '../styles/designSystem';

/**
 * THE OPERATOR'S LOG // FOUNDER'S MANIFESTO
 * A cyborg testimony of Vylos Labs.
 */

// DNA Strand Animation Component
const DNAHelix = () => {
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            opacity: 0.1,
            pointerEvents: 'none',
            zIndex: 0
        }}>
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Double Helix Simulation using Sine Waves */}
                {[0, 1].map((strand) => (
                    <motion.path
                        key={strand}
                        d={`M0,${50 + (strand * 20)} Q25,${20 + (strand * 20)} 50,${50 + (strand * 20)} T100,${50 + (strand * 20)} T150,${50 + (strand * 20)} T200,${50 + (strand * 20)}`}
                        fill="none"
                        stroke="url(#dnaGradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 1],
                            opacity: [0, 1, 0],
                            translateX: ['-100%', '0%', '100%']
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: strand * 5
                        }}
                        style={{
                            scaleY: 10, // Stretch vertically to cover screen
                            transformOrigin: 'center'
                        }}
                    />
                ))}
            </svg>

            {/* Binary Rain Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'5\' y=\'15\' fill=\'rgba(99, 102, 241, 0.1)\' font-family=\'monospace\' font-size=\'10\'%3E1%3C/text%3E%3Ctext x=\'15\' y=\'5\' fill=\'rgba(139, 92, 246, 0.1)\' font-family=\'monospace\' font-size=\'10\'%3E0%3C/text%3E%3C/svg%3E")',
                maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
            }} />
        </div>
    );
};

// Signature Animation
const Signature = () => {
    return (
        <svg width="200" height="80" viewBox="0 0 300 120" style={{ overflow: 'visible' }}>
            <motion.path
                d="M30,80 C50,60 40,40 60,50 C80,60 70,90 90,80 C110,70 120,50 140,60 C160,70 150,100 170,90 C190,80 200,60 220,70"
                // Note: simplified artistic representation of a signature 'Harsha'
                fill="none"
                stroke={colors.brand.primary}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
            />
            {/* Dot for 'i' or emphasis */}
            <motion.circle
                cx="240" cy="65" r="4"
                fill={colors.accent.secondary}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 3.5, type: 'spring' }}
            />
        </svg>
    );
};

const AboutPage = () => {
    return (
        <div style={{
            position: 'relative',
            minHeight: '100%',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {/* Background Atmosphere */}
            <DNAHelix />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    zIndex: 10
                }}
            >
                {/* Obsidian Glass Card */}
                <div style={{
                    background: 'rgba(10, 10, 12, 0.7)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    borderRadius: radius['2xl'],
                    padding: '4rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Glossy Reflection */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                    }} />

                    {/* Header */}
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <motion.h1
                            initial={{ opacity: 0, letterSpacing: '1em' }}
                            animate={{ opacity: 1, letterSpacing: '0.2em' }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '0.8rem',
                                color: colors.brand.primary,
                                textTransform: 'uppercase',
                                marginBottom: '1rem'
                            }}
                        >
                            The Operator&apos;s Log // Vylos Labs
                        </motion.h1>
                        <div style={{ width: '40px', height: '2px', background: colors.brand.secondary, margin: '0 auto' }} />
                    </div>

                    {/* Body Content */}
                    <div style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontSize: '1.25rem',
                        lineHeight: '1.8',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontStyle: 'italic',
                        marginBottom: '4rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Quote size={48} color={colors.text.dim} style={{ position: 'absolute', top: '3rem', left: '2rem', opacity: 0.2 }} />

                            <p style={{ marginBottom: '2rem' }}>
                                &quot;I’ll be honest—I know how to dissect a human cadaver, but I still don’t know how to center a <code style={{ fontFamily: "'JetBrains Mono', monospace", fontStyle: 'normal', fontSize: '0.9em', color: colors.brand.primary }}>div</code>.&quot;
                            </p>

                            <p style={{ marginBottom: '2rem' }}>
                                I’m <strong style={{ color: '#fff' }}>Harsha R B</strong>.
                                <br />
                                I’m writing this from a dorm room in <strong>Davanagere, Karnataka</strong>, where I’m currently studying to become a doctor (MBBS).
                            </p>

                            <p style={{ marginBottom: '2rem' }}>
                                Vylos Labs didn&apos;t start in a boardroom. It started because I noticed a terrifying pattern: we treat our smartphones with more care than our own biology. We charge them overnight, we protect them with cases, we panic when they overheat. But us? We run on 4 hours of sleep, eat data for breakfast, and wonder why we crash.
                            </p>

                            <p style={{ marginBottom: '2rem' }}>
                                I wanted to build a dashboard for the human machine. A tactical HUD for your life.
                            </p>

                            <p style={{ marginBottom: '2rem' }}>
                                The problem? I didn&apos;t know a single line of code.<br />
                                But I knew the logic of life.
                            </p>

                            <p style={{ marginBottom: '2rem' }}>
                                So, this app is a cyborg. It is my medical vision, fused with the silicon brain of the world&apos;s most advanced AI. It is a testament that in 2026, the only limit to building the future is how much you care about it.
                            </p>

                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                                To my family here, and to you:<br />
                                Don&apos;t just survive the future. <span style={{ color: colors.brand.secondary }}>Command it.</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Footer / Signature */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        gap: '2rem'
                    }}>
                        <div>
                            <div style={{ height: '80px', marginBottom: '0.5rem' }}>
                                <Signature />
                            </div>
                            <div style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '0.8rem',
                                color: colors.text.muted
                            }}>
                                Chief Architect & Tired Medical Student
                            </div>
                        </div>

                        {/* Credits */}
                        <div style={{
                            textAlign: 'right',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.7rem',
                            color: colors.text.dim,
                            lineHeight: '1.6'
                        }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                SYSTEM ARCHITECTURE<br />
                                <span style={{ color: colors.text.muted }}>Built with the ghost in the machine—Google Antigravity IDE & Claude Sonnet 4.5 (Thinking Module).</span>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                ESTABLISHMENT<br />
                                <span style={{ color: colors.text.muted }}>Est. 2025 // Davanagere, India.</span>
                            </div>
                            <div>
                                COPYRIGHT<br />
                                <span style={{ color: colors.text.muted }}>© 2025-2026 Vylos Labs. All Biological & Digital Rights Reserved.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default AboutPage;
