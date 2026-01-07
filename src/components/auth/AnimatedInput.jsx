import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const AnimatedInput = ({
    type = "text",
    label,
    value,
    onChange,
    disabled = false,
    icon: Icon
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <div className="relative group mb-5">
            <div className="relative">
                {/* Input Field */}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={clsx(
                        "w-full bg-white/5 border rounded-xl px-4 pt-6 pb-2 text-white outline-none transition-all duration-300",
                        "font-mono text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed",
                        isFocused || hasValue ? "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-white/10" : "border-white/10 hover:border-white/20"
                    )}
                />

                {/* Floating Label */}
                <label
                    className={clsx(
                        "absolute left-4 transition-all duration-200 pointer-events-none font-medium",
                        isFocused || hasValue
                            ? "top-1.5 text-[10px] text-indigo-400 tracking-wider uppercase"
                            : "top-4 text-sm text-neutral-500"
                    )}
                >
                    {label}
                </label>

                {/* Icon (Optional) */}
                {Icon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                        <Icon size={18} />
                    </div>
                )}
            </div>

            {/* Bottom Glow Line */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFocused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
            />
        </div>
    );
};

export default AnimatedInput;
