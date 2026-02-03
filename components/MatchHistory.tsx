import React, { useState } from 'react';
import { X, History, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { MatchRecord, Team } from '../types';

interface MatchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  records: MatchRecord[];
  onClearHistory: () => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({ 
  isOpen, 
  onClose, 
  records,
  onClearHistory
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('zh-TW', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-sm h-[80vh] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="text-blue-400" size={24} />
            歷史紀錄
          </h2>
          <div className="flex gap-2">
            {records.length > 0 && (
              <button 
                onClick={() => {
                  if(window.confirm('確定要清除所有紀錄嗎？')) onClearHistory();
                }} 
                className="p-2 text-rose-400 hover:bg-rose-900/30 rounded-full transition-colors"
                title="清除所有紀錄"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {records.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
               <History size={48} className="opacity-20" />
               <p>尚無比賽紀錄</p>
             </div>
          ) : (
             records.map((match) => {
               const isExpanded = expandedId === match.id;
               const leftName = match.teamNames[Team.Left];
               const rightName = match.teamNames[Team.Right];
               const leftScore = match.finalScores[Team.Left];
               const rightScore = match.finalScores[Team.Right];
               const leftWon = match.winner === Team.Left;

               return (
                 <div key={match.id} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    {/* Match Summary Card */}
                    <div 
                      onClick={() => toggleExpand(match.id)}
                      className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(match.timestamp)}</span>
                        {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Team Left */}
                        <div className={`flex flex-col items-start ${leftWon ? 'opacity-100' : 'opacity-60'}`}>
                          <span className="text-sm font-bold text-white mb-1">{leftName}</span>
                          <span className={`text-2xl font-mono font-bold ${leftWon ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {leftScore}
                          </span>
                        </div>
                        
                        <div className="h-8 w-px bg-slate-700 mx-4"></div>

                        {/* Team Right */}
                        <div className={`flex flex-col items-end ${!leftWon ? 'opacity-100' : 'opacity-60'}`}>
                          <span className="text-sm font-bold text-white mb-1">{rightName}</span>
                          <span className={`text-2xl font-mono font-bold ${!leftWon ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {rightScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Timeline Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950/30 p-3 space-y-1 max-h-48 overflow-y-auto">
                        <div className="text-xs text-slate-500 font-medium mb-2 px-1">得分過程</div>
                        {match.timeline.map((snap, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs py-1 px-2 hover:bg-white/5 rounded">
                            <span className="text-slate-500 font-mono w-6">#{idx + 1}</span>
                            <div className="flex gap-2 font-mono">
                               <span className={snap.servingTeam === Team.Left ? "text-emerald-400 font-bold" : "text-slate-400"}>
                                 {snap.scores[Team.Left]}
                               </span>
                               <span className="text-slate-600">-</span>
                               <span className={snap.servingTeam === Team.Right ? "text-emerald-400 font-bold" : "text-slate-400"}>
                                 {snap.scores[Team.Right]}
                               </span>
                            </div>
                            <span className="text-slate-600 truncate max-w-[80px] text-right">
                              發球: {match.teamNames[snap.servingTeam]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               );
             })
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};