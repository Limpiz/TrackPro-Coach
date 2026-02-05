import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, UserPlus, Trash2, Flag, User } from 'lucide-react';
import { formatTime, formatDelta } from '../utils';
import { Runner, Lap } from '../types';

const MultiRunnerTimer: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [globalTime, setGlobalTime] = useState(0);
  const [isRaceRunning, setIsRaceRunning] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState(90);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRaceRunning) {
      startTimeRef.current = performance.now() - globalTime * 1000;
      const update = () => {
        setGlobalTime((performance.now() - startTimeRef.current) / 1000);
        timerRef.current = requestAnimationFrame(update);
      };
      timerRef.current = requestAnimationFrame(update);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, [isRaceRunning]);

  const addRunner = () => {
    if (!newName) return;
    const newRunner: Runner = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      targetTime: newTarget,
      status: 'idle',
      startTime: null,
      endTime: null,
      laps: []
    };
    setRunners([...runners, newRunner]);
    setNewName('');
  };

  const startRace = () => {
    setIsRaceRunning(true);
    setRunners(runners.map(r => ({ ...r, status: 'running', startTime: performance.now() })));
  };

  const stopRace = () => {
    setIsRaceRunning(false);
    setRunners(runners.map(r => r.status === 'running' ? { ...r, status: 'finished', endTime: performance.now() } : r));
  };

  const resetRace = () => {
    if (window.confirm("Reset master clock and all runners?")) {
      setIsRaceRunning(false);
      setGlobalTime(0);
      setRunners(runners.map(r => ({ ...r, status: 'idle', startTime: null, endTime: null, laps: [] })));
    }
  };

  const recordLap = (id: string) => {
    setRunners(prev => prev.map(r => {
      if (r.id !== id || r.status !== 'running') return r;
      const lapNumber = r.laps.length + 1;
      const prevTime = r.laps.length > 0 ? r.laps[0].time : 0;
      const lapDuration = globalTime - prevTime;
      const lapDelta = lapDuration - r.targetTime;
      const targetDelta = globalTime - (lapNumber * r.targetTime);
      
      const newLap: Lap = {
        lapNumber,
        time: globalTime,
        duration: lapDuration,
        lapDelta,
        targetDelta
      };
      return { ...r, laps: [newLap, ...r.laps] };
    }));
  };

  const finishRunner = (id: string) => {
    setRunners(prev => prev.map(r => r.id === id ? { ...r, status: 'finished', endTime: performance.now() } : r));
  };

  const removeRunner = (id: string) => {
    setRunners(runners.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Clock</span>
            <span className="text-5xl font-mono font-bold text-emerald-400 tabular-nums">{formatTime(globalTime)}</span>
          </div>
          <div className="flex gap-2">
            {!isRaceRunning && globalTime === 0 ? (
              <button onClick={startRace} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95">
                <Play className="w-5 h-5 fill-slate-900" /> START RACE
              </button>
            ) : (
              <>
                <button onClick={isRaceRunning ? stopRace : resetRace} className={`px-6 py-3 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 ${isRaceRunning ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  {isRaceRunning ? 'STOP ALL' : <><RotateCcw className="w-5 h-5" /> RESET</>}
                </button>
              </>
            )}
          </div>
        </div>

        {!isRaceRunning && globalTime === 0 && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Runner name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-500 uppercase font-bold">Target (s/lap):</span>
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="w-12 bg-transparent font-mono text-center outline-none"
              />
            </div>
            <button onClick={addRunner} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
              <UserPlus className="w-6 h-6 text-slate-900" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {runners.map((runner) => (
          <div key={runner.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg flex flex-col">
            <div className="p-4 bg-slate-700/30 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold">{runner.name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target: {runner.targetTime}s</p>
                </div>
              </div>
              {!isRaceRunning && globalTime === 0 && (
                <button onClick={() => removeRunner(runner.id)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Elapsed</div>
                  <div className="text-3xl font-mono font-bold tabular-nums">
                    {runner.status === 'finished' ? formatTime(runner.laps[0]?.time || 0) : formatTime(globalTime)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total Delta</div>
                  <div className={`text-xl font-mono font-bold ${ (runner.laps[0]?.targetDelta || 0) <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {runner.laps.length > 0 ? formatDelta(runner.laps[0].targetDelta) : formatDelta(globalTime - runner.targetTime)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={runner.status !== 'running'}
                  onClick={() => recordLap(runner.id)}
                  className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-20 disabled:grayscale rounded-xl flex items-center justify-center gap-2 text-slate-900 font-bold transition-all active:scale-95"
                >
                  <Flag className="w-5 h-5" /> LAP {runner.laps.length + 1}
                </button>
                <button
                  disabled={runner.status !== 'running'}
                  onClick={() => finishRunner(runner.id)}
                  className="px-4 py-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-20 rounded-xl transition-all active:scale-95"
                >
                  FINISH
                </button>
              </div>

              {runner.laps.length > 0 && (
                <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                  {runner.laps.map(lap => (
                    <div key={lap.lapNumber} className="flex justify-between items-center text-xs py-1 border-b border-slate-700 last:border-0">
                      <span className="text-slate-500 font-bold">L{lap.lapNumber}</span>
                      <span className="font-mono">{formatTime(lap.duration)}</span>
                      <span className={`font-mono font-bold ${lap.targetDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatDelta(lap.targetDelta)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {runners.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 italic">
            Add some runners to start a multi-track race.
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiRunnerTimer;