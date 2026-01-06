import { useEffect } from 'react';

/**
 * KEYBOARD SHORTCUTS HOOK
 * Power user features for rapid data entry
 */

const useKeyboardShortcuts = () => {
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Only trigger if not in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }

            // Ctrl/Cmd + Key shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'l':
                        e.preventDefault();
                        scrollToModule('learning');
                        break;
                    case 's':
                        e.preventDefault();
                        scrollToModule('screen');
                        break;
                    case 'n':
                        e.preventDefault();
                        scrollToModule('nutrition');
                        break;
                    case 't':
                        e.preventDefault();
                        scrollToModule('training');
                        break;
                    case 'r':
                        e.preventDefault();
                        scrollToModule('sleep'); // R for Recovery
                        break;
                    case 'a':
                        e.preventDefault();
                        scrollToModule('analytics');
                        break;
                    default:
                        break;
                }
            }

            // Single key shortcuts (when not in input)
            switch (e.key) {
                case '?':
                    e.preventDefault();
                    showShortcutsHelp();
                    break;
                case 'Escape':
                    // Close any open modals or reset focus
                    document.activeElement?.blur();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);
};

// Helper: Scroll to module
const scrollToModule = (moduleName) => {
    const moduleMap = {
        'learning': 'LEARNING LOAD TRACKER',
        'screen': 'SCREEN TIME ANALYSIS',
        'nutrition': 'METABOLISM',
        'training': 'PHYSICALITY',
        'sleep': 'RECOVERY',
        'analytics': 'LONGITUDINAL ANALYSIS'
    };

    const searchText = moduleMap[moduleName];
    if (!searchText) return;

    // Find the header containing the module name
    const headers = Array.from(document.querySelectorAll('h2, h3'));
    const targetHeader = headers.find(h => h.textContent.includes(searchText));

    if (targetHeader) {
        targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus first input in that section
        const section = targetHeader.closest('section');
        const firstInput = section?.querySelector('input, select, button');
        setTimeout(() => firstInput?.focus(), 500);
    }
};

// Helper: Show shortcuts overlay
const showShortcutsHelp = () => {
    const existing = document.getElementById('shortcuts-overlay');
    if (existing) {
        existing.remove();
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'shortcuts-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #161B22;
        border: 2px solid var(--text-primary);
        padding: 2rem;
        z-index: 10000;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        max-width: 500px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.8);
    `;

    overlay.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">KEYBOARD SHORTCUTS</h3>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem;">
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Ctrl+L</kbd>
            <span>Jump to Learning</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Ctrl+S</kbd>
            <span>Jump to Screen Time</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Ctrl+N</kbd>
            <span>Jump to Nutrition</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Ctrl+T</kbd>
            <span>Jump to Training</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Ctrl+R</kbd>
            <span>Jump to Recovery (Sleep)</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Ctrl+A</kbd>
            <span>Jump to Analytics</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">?</kbd>
            <span>Toggle this help</span>
            
            <kbd style="background: #0E1116; padding: 0.25rem 0.5rem; border: 1px solid var(--border-subtle);">Esc</kbd>
            <span>Blur focus</span>
        </div>
        <p style="margin-top: 1rem; font-size: 0.7rem; color: var(--text-secondary);">
            Press ? again to close
        </p>
    `;

    document.body.appendChild(overlay);

    // Click outside to close
    setTimeout(() => {
        const closeOnClick = (e) => {
            if (!overlay.contains(e.target)) {
                overlay.remove();
                document.removeEventListener('click', closeOnClick);
            }
        };
        document.addEventListener('click', closeOnClick);
    }, 100);
};

export default useKeyboardShortcuts;
