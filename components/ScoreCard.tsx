import React from 'react';
import { Team } from '../types';

interface ScoreCardProps {
  teamName: string;
  score: number;
  isServing: boolean;
  serverNumber: 1 | 2;
  isWinner: boolean;
  onClick: () => void;
  disabled: boolean;
  side: 'left' | 'right';
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  teamName, 
  score, 
  isServing, 
  serverNumber, 
  isWinner,
  onClick,
  disabled,
  side
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center w-full h-full rounded-3xl p-4 transition-all duration-300
        ${isWinner ? 'bg-amber-500 text-slate-900 border-4 border-yellow-300' : ''}
        ${!isWinner && isServing ? 'bg-slate-700 border-4 border-emerald-500 shadow-lg shadow-emerald-900/30' : ''}
        ${!isWinner && !isServing ? 'bg-slate-800 border-2 border-slate-700 opacity-80' : ''}
      `}
    >
      {/* Serving Indicator Badge */}
      {isServing && !isWinner && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-slate-900 font-bold px-3 py-1 rounded-full text-xs sm:text-sm shadow-md animate-pulse">
          發球 #{serverNumber}
        </div>
      )}

      {/* Team Name */}
      <div className="text-slate-400 text-sm sm:text-lg font-medium tracking-wide uppercase mb-2">
        {teamName}
      </div>

      {/* Big Score */}
      <div className={`font-mono font-bold leading-none ${isWinner ? 'text-slate-900' : 'text-white'} text-[6rem] sm:text-[8rem] md:text-[10rem]`}>
        {score}
      </div>

      {/* Action Prompt */}
      {!disabled && !isWinner && (
        <div className="mt-4 px-6 py-2 rounded-full bg-white/10 text-sm font-semibold backdrop-blur-sm">
          {isServing ? "+ 得分" : "等待發球"}
        </div>
      )}
      
      {/* Winner Badge */}
      {isWinner && (
         <div className="absolute bottom-8 px-6 py-2 rounded-full bg-black/20 text-xl font-bold backdrop-blur-sm">
          獲勝 🏆
        </div>
      )}
    </button>
  );
};