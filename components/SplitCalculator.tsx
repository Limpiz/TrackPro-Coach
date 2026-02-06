import React, { useState, useMemo } from 'react';
import { formatTime, parseTimeToSeconds } from '../utils';

const SplitCalculator: React.FC = () => {
  // 1. Updated types to allow empty strings
  const [distance, setDistance] = useState<number | "">(5000);
  const [timeStr, setTimeStr] = useState<string>("18:30");
  const [splitFrequency, setSplitFrequency] = useState<number | "">(400);

  const calculatedSplits = useMemo(() => {
    const totalSeconds = parseTimeToSeconds(timeStr);
    
    // 2. We convert to Number here to ensure math works even if state is ""
    const distNum = Number(distance);
    const freqNum = Number(splitFrequency);

    if (totalSeconds <= 0 || distNum <= 0 || freqNum <= 0) return [];

    const pacePerMeter = totalSeconds / distNum;
    const numSplits = Math.ceil(distNum / freqNum);
    const splits = [];

    for (let i = 1; i <= numSplits; i++) {
      const splitDist = Math.min(i * freqNum, distNum);
      const splitTime = splitDist * pacePerMeter;
      const prevSplitDist = (i - 1) * freqNum;
      const lapTime = (splitDist - prevSplitDist) * pacePerMeter;

      splits.push({
        distance: splitDist,
        elapsedTime: splitTime,
        lapTime: lapTime
      });
    }

    return splits;
  }, [distance, timeStr, splitFrequency]);

  const pacePerKm = useMemo(() => {
    const totalSeconds = parseTimeToSeconds(timeStr);
    const distNum = Number(distance);
    
    if (totalSeconds <= 0 || distNum <= 0) return "0:00";
    const secPerKm = (totalSeconds / distNum) * 1000;
    return formatTime(secPerKm, false);
  }, [distance, timeStr]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-emerald-400">Race Split Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* DISTANCE INPUT */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Race Distance (meters)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Target Time (HH:MM:SS)</label>
            <input
              type="text"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              placeholder="e.g. 18:30"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            />
          </div>

          {/* SPLIT FREQUENCY INPUT */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Split Marks Every (meters)</label>
            <div className="relative">
              <input
                type="number"
                value={splitFrequency}
                onChange={(e) => setSplitFrequency(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3 top-2 text-slate-500 text-sm">m</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Calculated Pace (/km)</label>
            <div className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-emerald-400 font-mono text-lg font-bold">
              {pacePerKm}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-slate-300">Distance</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-300">Target Elapsed</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-300">Lap Split</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {calculatedSplits.map((split, idx) => (
              <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 font-medium">{split.distance}m</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{formatTime(split.elapsedTime)}</td>
                <td className="px-4 py-3 font-mono text-slate-400 text-sm">{formatTime(split.lapTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SplitCalculator;