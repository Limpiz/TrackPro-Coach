export const formatTime = (seconds: number, showMs = true): string => {
  if (isNaN(seconds) || seconds < 0) return "--:--.--";
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  const hStr = hrs > 0 ? `${hrs}:` : "";
  const mStr = mins < 10 && hrs > 0 ? `0${mins}:` : `${mins}:`;
  const sStr = secs < 10 ? `0${secs}` : `${secs}`;
  const msStr = showMs ? `.${ms < 10 ? '0' + ms : ms}` : "";

  return `${hStr}${mStr}${sStr}${msStr}`;
};

export const formatDelta = (seconds: number): string => {
  const sign = seconds >= 0 ? "+" : "-";
  return `${sign}${formatTime(Math.abs(seconds), true)}`;
};

export const parseTimeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  } else if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  } else if (parts.length === 1) {
    return parts[0] || 0;
  }
  return 0;
};

export const distanceToMeters = (value: number, unit: string): number => {
  switch (unit) {
    case 'km': return value * 1000;
    case 'miles': return value * 1609.34;
    default: return value;
  }
};