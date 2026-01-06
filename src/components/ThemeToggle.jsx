import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const saved = localStorage.getItem('pl_theme') || 'dark';
        setTheme(saved);
        applyTheme(saved);
    }, []);

    const applyTheme = (newTheme) => {
        const root = document.documentElement;

        if (newTheme === 'light') {
            root.style.setProperty('--bg-primary', '#FFFFFF');
            root.style.setProperty('--bg-card', '#F6F8FA');
            root.style.setProperty('--text-primary', '#24292F');
            root.style.setProperty('--text-secondary', '#57606A');
            root.style.setProperty('--border-subtle', '#D0D7DE');
        } else {
            root.style.setProperty('--bg-primary', '#0E1116');
            root.style.setProperty('--bg-card', '#161B22');
            root.style.setProperty('--text-primary', '#E6EDF3');
            root.style.setProperty('--text-secondary', '#7D8590');
            root.style.setProperty('--border-subtle', '#30363D');
        }
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('pl_theme', newTheme);
        applyTheme(newTheme);
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            <button
                onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
        </div>
    );
};

export default ThemeToggle;
