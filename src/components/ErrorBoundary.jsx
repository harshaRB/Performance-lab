import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-[#0F1115] border border-rose-500/20 rounded-3xl p-8 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-4">
                            <AlertTriangle className="text-rose-400" size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">System Fault Detected</h1>
                        <p className="text-neutral-400 text-sm mb-6">
                            A critical error has disrupted the application core. Our protocol suggests a system reset.
                        </p>
                        {this.state.error && (
                            <div className="bg-neutral-900 border border-white/5 rounded-lg p-3 mb-6 text-left">
                                <code className="text-xs text-rose-300 font-mono block overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold tracking-widest uppercase text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Initialize Recovery
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
