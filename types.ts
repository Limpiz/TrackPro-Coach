export interface Lap {
  lapNumber: number;
  time: number; // Total elapsed time at end of lap
  duration: number; // Time for just this lap
  lapDelta: number; // Ahead/behind target for JUST this lap
  targetDelta: number; // Total ahead/behind target at this point in race (cumulative)
}

export interface Runner {
  id: string;
  name: string;
  targetTime: number; // in seconds
  status: 'idle' | 'running' | 'finished';
  startTime: number | null;
  endTime: number | null;
  laps: Lap[];
}

export enum AppTab {
  CALCULATOR = 'calculator',
  STOPWATCH = 'stopwatch',
  MULTI_RUNNER = 'multi_runner'
}

export interface SplitResult {
  distance: number;
  time: string;
  pace: string;
}