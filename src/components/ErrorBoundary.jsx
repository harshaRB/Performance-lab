import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        this.setState({ error, errorInfo });

        // Log to localStorage for debugging
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.toString(),
            stack: errorInfo.componentStack
        };
        const logs = JSON.parse(localStorage.getItem('pl_error_logs') || '[]');
        logs.push(errorLog);
        localStorage.setItem('pl_error_logs', JSON.stringify(logs.slice(-10))); // Keep last 10
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    background: 'var(--bg-card)',
                    border: '2px solid var(--accent-danger)',
                    padding: '2rem',
                    margin: '2rem',
                    borderRadius: '4px'
                }}>
                    <h2 className="mono" style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>
                        ⚠️ MODULE ERROR
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        This module encountered an error and has been isolated to prevent system-wide failure.
                    </p>
                    <details style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                            Technical Details
                        </summary>
                        <pre style={{
                            background: 'var(--bg-primary)',
                            padding: '1rem',
                            overflow: 'auto',
                            fontSize: '0.75rem'
                        }}>
                            {this.state.error && this.state.error.toString()}
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            background: 'var(--accent-danger)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)'
                        }}
                    >
                        RETRY MODULE
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
