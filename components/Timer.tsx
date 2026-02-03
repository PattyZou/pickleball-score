import React, { useEffect, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
  onReset: () => void;
  onToggle: () => void;
}

export const Timer: React.FC<TimerProps> = ({ isRunning, onReset, onToggle }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSeconds(0);
    onReset();
  };

  return (
    <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-2 border border-slate-700">
      <div className="font-mono text-xl text-emerald-400 w-16 text-center">
        {formatTime(seconds)}
      </div>
      <button onClick={onToggle} className="p-1 hover:text-emerald-400 transition-colors">
        {isRunning ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button onClick={handleReset} className="p-1 hover:text-rose-400 transition-colors">
        <RefreshCw size={18} />
      </button>
    </div>
  );
};
