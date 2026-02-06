import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Flag, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { formatTime, formatDelta, parseTimeToSeconds } from '../utils';
import { Lap } from '../types';

const ProStopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  // --- 1. SETTINGS: Updated to allow empty strings ---
  const [lapDist, setLapDist] = useState<number | "">(400);
  const [totalRaceDist, setTotalRaceDist] = useState<number | "">(5000);
  const [targetTotalTimeStr, setTargetTotalTimeStr] = useState("18:30");

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - time * 1000;
      const update = () => {
        const now = performance.now();
        setTime((now - startTimeRef.current) / 1000);
        timerRef.current = requestAnimationFrame(update);
      };
      timerRef.current = requestAnimationFrame(update);
    } else {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isRunning]);

  // --- 2. MATH SAFETY: Wrap values in Number() to handle empty strings safely ---
  const targetTotalSeconds = useMemo(() => parseTimeToSeconds(targetTotalTimeStr), [targetTotalTimeStr]);
  const targetPacePerMeter = useMemo(() => {
    const dist = Number(totalRaceDist);
    return targetTotalSeconds / (dist || 1);
  }, [targetTotalSeconds, totalRaceDist]);

  const targetTimePerLap = useMemo(() => {
    const lDist = Number(lapDist);
    return targetPacePerMeter * lDist;
  }, [targetPacePerMeter, lapDist]);

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    setTime(0);
    setLaps([]);
    startTimeRef.current = 0;
  };

  const handleLap = () => {
    const lDist = Number(lapDist);
    const lapNumber = laps.length + 1;
    const currentTotalTime = time;
    const prevTotalTime = laps.length > 0 ? laps[0].time : 0;
    const lapDuration = currentTotalTime - prevTotalTime;
    
    const metersCovered = lapNumber * lDist;
    const expectedTimeAtThisDist = metersCovered * targetPacePerMeter;
    const cumulativeDelta = currentTotalTime - expectedTimeAtThisDist;
    const lapDelta = lapDuration - targetTimePerLap;

    const newLap: Lap = {
      lapNumber,
      time: currentTotalTime,
      duration: lapDuration,
      lapDelta,
      targetDelta: cumulativeDelta
    };
    setLaps([newLap, ...laps]);
  };

  const lastCompletedMeters = laps.length * Number(lapDist);
  
  const predictedFinish = useMemo(() => {
    const dist = Number(totalRaceDist);
    if (laps.length === 0) return targetTotalSeconds;
    const avgPaceSoFar = laps[0].time / (lastCompletedMeters || 1);
    return avgPaceSoFar * dist;
  }, [laps, totalRaceDist, lastCompletedMeters, targetTotalSeconds]);

  const totalDeltaAtLastSplit = laps.length > 0 ? laps[0].targetDelta : 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2 mb-4 text-emerald-400">
          <Target className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Race Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* TOTAL DISTANCE INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Total Distance (m)</label>
            <input 
              type="number"
              value={totalRaceDist}
              onChange={(e) => setTotalRaceDist(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Target Finish Time</label>
            <input 
              type="text"
              value={targetTotalTimeStr}
              onChange={(e) => setTargetTotalTimeStr(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* LAP DISTANCE INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Lap Length (m)</label>
            <input 
              type="number"
              value={lapDist}
              onChange={(e) => setLapDist(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Stopwatch Interface (Rest of the UI stays the same) */}
      <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col items-center">
        <div className="flex flex-col items-center mb-6 text-center">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Elapsed Time</div>
            <div className="text-7xl font-bold font-mono text-emerald-400 tabular-nums drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                {formatTime(time)}
            </div>
        </div>

        <div className="flex flex-col items-center mb-8 px-8 py-4 bg-slate-900/40 rounded-3xl border border-slate-700/50 w-full max-w-sm">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                <Clock className="w-3 h-3" /> Current Lap ({laps.length + 1})
            </div>
            <div className="text-4xl font-bold font-mono text-blue-400 tabular-nums">
                {formatTime(time - (laps.length > 0 ? laps[0].time : 0))}
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700">
            <span className="text-[9px] uppercase font-bold text-slate-500">Target (Lap)</span>
            <span className="text-lg font-mono text-emerald-400/80">{formatTime(targetTimePerLap)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] uppercase font-bold text-slate-500">Total Delta</span>
            </div>
            <span className={`text-lg font-mono font-bold ${totalDeltaAtLastSplit <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatDelta(totalDeltaAtLastSplit)}
            </span>
          </div>

          <div className="flex flex-col items-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700 col-span-2 md:col-span-1">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-[9px] uppercase font-bold text-slate-500">Est. Finish</span>
            </div>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {formatTime(predictedFinish)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-10 w-full">
          <button
            onClick={handleReset}
            className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl flex items-center justify-center transition-all active:scale-95 text-slate-200"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={handleStartStop}
            className={`flex-[2] py-4 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isRunning ? <Pause className="w-8 h-8 text-slate-900 fill-slate-900" /> : <Play className="w-8 h-8 text-slate-900 fill-slate-900" />}
          </button>
          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all active:scale-95"
          >
            <Flag className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </div>

      {/* Lap History List (omitted for brevity, remains unchanged) */}
    </div>
  );
};

export default ProStopwatch;