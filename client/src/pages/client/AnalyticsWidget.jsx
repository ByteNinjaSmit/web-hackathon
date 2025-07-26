import React from 'react';

const data = [
  { label: 'Mon', value: 8 },
  { label: 'Tue', value: 12 },
  { label: 'Wed', value: 10 },
  { label: 'Thu', value: 15 },
  { label: 'Fri', value: 7 },
  { label: 'Sat', value: 18 },
  { label: 'Sun', value: 11 },
];

const AnalyticsWidget = () => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold text-purple-900 mb-4">Weekly Purchases</h3>
    <div className="flex items-end h-32 gap-2 mb-4">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center w-8">
          <div
            className="bg-purple-400 rounded-t-lg"
            style={{ height: `${d.value * 6}px`, width: '100%' }}
          ></div>
          <span className="text-xs text-gray-500 mt-1">{d.label}</span>
        </div>
      ))}
    </div>
    <div className="text-sm text-gray-600 text-center">Total: 81 purchases this week</div>
  </div>
);

export default AnalyticsWidget; 