import React from 'react';
import { motion } from 'framer-motion';

const AuthBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505] selection:bg-indigo-500/30">
            {/* 1. Base Gradient Mesh - Breathing Animation */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-900/20 blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-violet-900/20 blur-[120px]"
            />

            {/* 2. Grid Overlay (Tactical Feel) */}
            <div
                className="absolute inset-0 z-10 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 3. Scanline / Noise Texture */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.02] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* 4. Vignette */}
            <div className="absolute inset-0 z-30 bg-radial-gradient from-transparent via-[#050505]/50 to-[#050505]" />
        </div>
    );
};

export default AuthBackground;
