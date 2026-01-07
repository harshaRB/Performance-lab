import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const NeonButton = ({ children, onClick, isLoading = false, type = "button", variant = "primary" }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            type={type}
            disabled={isLoading}
            className={clsx(
                "relative w-full py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all overflow-hidden group",
                variant === 'primary'
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] border border-indigo-400/50"
                    : "bg-transparent text-white border border-white/20 hover:bg-white/5",
                isLoading && "opacity-80 cursor-wait"
            )}
        >
            {/* Inner Glow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="relative flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="animate-spin" size={18} />}
                {children}
            </div>
        </motion.button>
    );
};

export default NeonButton;
