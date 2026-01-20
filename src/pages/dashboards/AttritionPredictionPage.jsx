import React, { useState } from 'react';

export default function AttritionPredictionPage() {
    const [data] = useState([
        { id: 1, name: 'Grace Park', risk: 'High', reason: 'High Call Drop Rate', prediction: '85%' },
        { id: 2, name: 'John Doe', risk: 'Medium', reason: 'Declining CSAT', prediction: '60%' },
        { id: 3, name: 'Jane Smith', risk: 'Low', reason: 'Stable Performance', prediction: '15%' },
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Attrition Prediction</h1>
                <p className="text-slate-500">Predict and analyze potential consultant turnover.</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold">Risk Analysis For New Consultants</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-sm text-slate-500">
                                <th className="py-2">Consultant Name</th>
                                <th className="py-2">Risk Level</th>
                                <th className="py-2">Primary Factor</th>
                                <th className="py-2">Attrition Probability</th>
                                <th className="py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="py-3 font-semibold">{item.name}</td>
                                    <td className="py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.risk === 'High'
                                                    ? 'bg-red-100 text-red-800'
                                                    : item.risk === 'Medium'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            {item.risk}
                                        </span>
                                    </td>
                                    <td className="py-3 text-slate-600">{item.reason}</td>
                                    <td className="py-3 text-slate-900">{item.prediction}</td>
                                    <td className="py-3">
                                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
