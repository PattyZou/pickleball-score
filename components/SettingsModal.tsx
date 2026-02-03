import React from 'react';
import { X, Trophy, Check, Users } from 'lucide-react';
import { Team } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  winningScore: number;
  setWinningScore: (score: number) => void;
  teamNames: { [Team.Left]: string; [Team.Right]: string };
  setTeamName: (team: Team, name: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  winningScore, 
  setWinningScore,
  teamNames,
  setTeamName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-sm rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-400" size={24} />
            比賽設定
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Team Names */}
          <div>
            <label className="block text-slate-400 text-sm mb-3 font-medium flex items-center gap-2">
              <Users size={16} /> 隊伍名稱
            </label>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 block mb-1">左側隊伍</span>
                <input 
                  type="text" 
                  value={teamNames[Team.Left]}
                  onChange={(e) => setTeamName(Team.Left, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">右側隊伍</span>
                <input 
                  type="text" 
                  value={teamNames[Team.Right]}
                  onChange={(e) => setTeamName(Team.Right, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Score Settings */}
          <div>
            <label className="block text-slate-400 text-sm mb-4 font-medium">獲勝分數 (Win Score)</label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 7, 11].map((score) => (
                <button
                  key={score}
                  onClick={() => setWinningScore(score)}
                  className={`
                    py-3 px-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                    ${winningScore === score 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                  `}
                >
                  {score}
                  {winningScore === score && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-slate-900/50 rounded-xl text-xs text-slate-400 leading-relaxed">
            註：標準匹克球比賽通常為 11 分制，且必須領先 2 分才能獲勝。
          </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};