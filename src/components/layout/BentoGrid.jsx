import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * BentoGrid Layout Component
 * 
 * A responsive CSS Grid layout for dashboard cards.
 * Supports various span configurations for visual hierarchy.
 * 
 * @param {React.ReactNode} children - Grid items
 * @param {string} className - Additional CSS classes
 * @param {number} columns - Base column count (default: 4)
 * @param {string} gap - Gap size (default: '1.5rem')
 */
const BentoGrid = ({
    children,
    className = '',
    columns = 4,
    gap = '1.5rem',
}) => {
    return (
        <div
            className={clsx('bento-grid', className)}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
                width: '100%',
            }}
        >
            {children}
        </div>
    );
};

/**
 * BentoGrid Item Component
 * 
 * Individual grid item with span support and animations.
 * 
 * @param {React.ReactNode} children - Item content
 * @param {number} colSpan - Column span (1-4)
 * @param {number} rowSpan - Row span (1-2)
 * @param {string} className - Additional CSS classes
 */
const BentoItem = ({
    children,
    colSpan = 1,
    rowSpan = 1,
    className = '',
    delay = 0,
}) => {
    return (
        <motion.div
            className={clsx(
                'bento-item',
                'bg-surface/60 backdrop-blur-sm',
                'border border-white/[0.06] rounded-2xl',
                'transition-all duration-300',
                'hover:border-white/[0.12] hover:shadow-glass',
                className
            )}
            style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                minHeight: rowSpan > 1 ? '320px' : '160px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: delay * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
                scale: 1.01,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)',
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Responsive Bento Grid with automatic column adjustment
 */
const ResponsiveBentoGrid = ({ children, className = '' }) => {
    return (
        <div
            className={clsx(
                'responsive-bento-grid',
                'grid gap-4 md:gap-6',
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                className
            )}
        >
            {children}
        </div>
    );
};

// CSS for responsive spans (add to your global styles if needed)
const BentoStyles = `
    /* Responsive column spans */
    @media (max-width: 640px) {
        .bento-item { grid-column: span 1 !important; }
    }
    
    @media (min-width: 641px) and (max-width: 1024px) {
        .bento-item[style*="span 3"],
        .bento-item[style*="span 4"] {
            grid-column: span 2 !important;
        }
    }
    
    /* Phantom border effect */
    .bento-item:hover {
        box-shadow: 
            0 0 0 1px rgba(99, 102, 241, 0.2),
            0 0 30px rgba(99, 102, 241, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.3);
    }
`;

// Inject styles once
if (typeof document !== 'undefined') {
    const styleId = 'bento-grid-styles';
    if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.textContent = BentoStyles;
        document.head.appendChild(styleEl);
    }
}

export { BentoGrid, BentoItem, ResponsiveBentoGrid };
export default BentoGrid;
