import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export const RadarWidget = ({ data }) => {
    // Expects data format: [{ subject: 'Math', A: 120, fullMark: 150 }, ...]

    if (!data || data.length === 0) return (
        <div className="h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
            NO DATA
        </div>
    );

    return (
        <div className="w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#262626" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#737373', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="#6366f1"
                        fillOpacity={0.25}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0F1115',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        separator=": "
                        cursor={false}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarWidget;
