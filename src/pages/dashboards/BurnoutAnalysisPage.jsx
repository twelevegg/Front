import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BurnoutAnalysisPage() {
    const data = [
        { name: 'Team A', Stress: 65, Fatigue: 40 },
        { name: 'Team B', Stress: 85, Fatigue: 70 },
        { name: 'Team C', Stress: 45, Fatigue: 30 },
        { name: 'Team D', Stress: 55, Fatigue: 50 },
        { name: 'Team E', Stress: 75, Fatigue: 60 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Burnout Analysis</h1>
                <p className="text-slate-500">Monitor stress levels and burnout indicators across teams.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">Stress & Fatigue Overview</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Stress" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Fatigue" fill="#ffc658" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">Recommendations</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
                            <span className="text-red-500 mt-1">⚠️</span>
                            <div>
                                <div className="font-semibold text-red-900">High Risk: Team B</div>
                                <div className="text-sm text-red-700">Immediate intervention recommended. Scheduled breaks are missed frequently.</div>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 rounded-lg bg-amber-50 p-3">
                            <span className="text-amber-500 mt-1">⚠️</span>
                            <div>
                                <div className="font-semibold text-amber-900">Moderate Risk: Team E</div>
                                <div className="text-sm text-amber-700">Suggest workload redistribution for the upcoming week.</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
