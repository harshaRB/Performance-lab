import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Analytics = () => {
    const { scores, dailyLogs } = useAppStore();

    // Data for Radar Chart (Module Balance)
    const radarData = [
        { subject: 'Nutrition', A: scores.nutrition || 0, fullMark: 100 },
        { subject: 'Sleep', A: scores.sleep || 0, fullMark: 100 },
        { subject: 'Training', A: scores.training || 0, fullMark: 100 },
        { subject: 'Learning', A: scores.learning || 0, fullMark: 100 },
        { subject: 'Screen', A: scores.screen || 0, fullMark: 100 },
    ];

    // Placeholder data for history - in a real app this would process dailyLogs
    const historyData = Object.keys(dailyLogs).slice(-7).map(date => ({
        date: date.substring(5),
        score: Math.floor(Math.random() * 20 + 70) // Mocking history for visual structure if real history is sparse
    }));

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Deep Dive Analytics</h1>
                <p className="text-neutral-500">System correlations, trends, and recovery metrics.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module Balance Radar */}
                <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">System Balance</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="#6366f1"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sleep Debt / Recovery Trend */}
                <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">7-Day Consistency</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#555" tick={{ fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                                />
                                <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Correlation Matrix Placeholder */}
            <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Correlation Matrix</h3>
                <div className="grid grid-cols-5 gap-1 text-center text-xs font-mono">
                    <div className="text-neutral-500"></div>
                    <div className="text-neutral-500">Sleep</div>
                    <div className="text-neutral-500">Train</div>
                    <div className="text-neutral-500">Nutri</div>
                    <div className="text-neutral-500">Focus</div>

                    <div className="text-neutral-500 py-2">Sleep</div>
                    <div className="bg-indigo-500/20 py-2 text-indigo-300">1.0</div>
                    <div className="bg-indigo-500/10 py-2 text-indigo-400">0.8</div>
                    <div className="bg-neutral-800 py-2 text-neutral-600">0.2</div>
                    <div className="bg-indigo-500/5 py-2 text-indigo-500">0.4</div>

                    <div className="text-neutral-500 py-2">Train</div>
                    <div className="bg-indigo-500/10 py-2 text-indigo-400">0.8</div>
                    <div className="bg-rose-500/20 py-2 text-rose-300">1.0</div>
                    <div className="bg-rose-500/10 py-2 text-rose-400">0.6</div>
                    <div className="bg-neutral-800 py-2 text-neutral-600">-0.1</div>
                </div>
                <p className="text-center text-xs text-neutral-600 mt-4 italic">
                    * Real-time Pearson calculation requires 14+ days of data. Showing sample vectors.
                </p>
            </div>
        </div>
    );
};

export default Analytics;
