import React, { useState, useCallback } from 'react';
import { Settings, Undo2, History } from 'lucide-react';
import { GameState, Team, MatchRecord } from './types';
import { INITIAL_STATE, checkWinCondition, createSnapshot } from './utils/gameLogic';
import { Timer } from './components/Timer';
import { ScoreCard } from './components/ScoreCard';
import { Button } from './components/Button';
import { SettingsModal } from './components/SettingsModal';
import { MatchHistory } from './components/MatchHistory';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [matchRecords, setMatchRecords] = useState<MatchRecord[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const saveHistory = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, createSnapshot(prev)].slice(-50) // Keep last 50 moves for undo
    }));
  }, []);

  const handleUndo = () => {
    setGameState(prev => {
      if (prev.history.length === 0) return prev;
      const lastState = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);
      
      return {
        ...prev,
        scores: lastState.scores,
        servingTeam: lastState.servingTeam,
        serverNumber: lastState.serverNumber,
        winner: null,
        gameStatus: prev.history.length === 1 ? 'idle' : 'playing',
        history: newHistory
      };
    });
  };

  const handleNewMatch = () => {
    // Archive current game if it has a winner
    if (gameState.winner) {
      const record: MatchRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        teamNames: gameState.matchSettings.teamNames,
        finalScores: gameState.scores,
        winner: gameState.winner,
        timeline: gameState.history
      };
      setMatchRecords(prev => [record, ...prev]);
    }

    // Reset game state
    setTimerRunning(false);
    setGameState(prev => ({
      ...INITIAL_STATE,
      matchSettings: prev.matchSettings, // Preserve custom names/settings
      gameStatus: 'idle' // Go back to idle or playing? Usually idle to start fresh
    }));
  };

  const startGame = () => {
    // If there was a finished game sitting there unarchived (edge case), archive it
    if (gameState.winner) {
      handleNewMatch();
    }
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing'
    }));
    setTimerRunning(true);
  };

  // --- Core Game Logic ---

  const handlePoint = () => {
    if (gameState.winner) return;
    saveHistory();

    setGameState(prev => {
      const newScores = { ...prev.scores };
      newScores[prev.servingTeam]++;
      
      // Check win
      const winner = checkWinCondition({ ...prev, scores: newScores });
      
      if (winner) {
        setTimerRunning(false);
      }

      return {
        ...prev,
        scores: newScores,
        gameStatus: 'playing',
        winner
      };
    });
  };

  const handleFault = () => {
    if (gameState.winner) return;
    saveHistory();

    setGameState(prev => {
      let nextServerNumber = prev.serverNumber;
      let nextServingTeam = prev.servingTeam;

      if (prev.serverNumber === 1) {
        // Server 1 lost -> Move to Server 2
        nextServerNumber = 2;
      } else {
        // Server 2 lost -> Side Out
        nextServerNumber = 1;
        nextServingTeam = prev.servingTeam === Team.Left ? Team.Right : Team.Left;
      }

      return {
        ...prev,
        servingTeam: nextServingTeam,
        serverNumber: nextServerNumber,
        gameStatus: 'playing'
      };
    });
  };

  // Button Handlers
  const handleTeamClick = (team: Team) => {
    if (gameState.gameStatus === 'idle' || gameState.winner) return;

    if (team === gameState.servingTeam) {
      handlePoint();
    } else {
      handleFault();
    }
  };

  const scoreString = `${gameState.scores[gameState.servingTeam]}-${gameState.scores[gameState.servingTeam === Team.Left ? Team.Right : Team.Left]}-${gameState.serverNumber}`;
  const teamNames = gameState.matchSettings.teamNames;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-slate-900 shadow-2xl relative">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md z-10 gap-2">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Settings size={24} />
        </button>

        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <History size={24} />
        </button>
        
        <div className="flex-1 flex justify-center">
          <Timer 
            isRunning={timerRunning} 
            onToggle={() => setTimerRunning(!timerRunning)} 
            onReset={() => {
              setTimerRunning(false);
              // Simple reset of timer doesn't reset game logic, just the clock
            }} 
          />
        </div>

        <button 
          onClick={handleUndo}
          disabled={gameState.history.length === 0}
          className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <Undo2 size={24} />
        </button>
      </header>

      {/* Main Score Area - Split Screen */}
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
        
        {/* Current Call Display */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-slate-950/90 text-white font-mono font-bold text-xl px-4 py-1 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md whitespace-nowrap">
            喊分: {scoreString}
          </div>
        </div>

        {/* Team 1 Area */}
        <div className="flex-1 min-h-0">
          <ScoreCard 
            teamName={teamNames[Team.Left]}
            side="left"
            score={gameState.scores[Team.Left]}
            isServing={gameState.servingTeam === Team.Left}
            serverNumber={gameState.serverNumber}
            isWinner={gameState.winner === Team.Left}
            onClick={() => handleTeamClick(Team.Left)}
            disabled={gameState.gameStatus === 'idle'}
          />
        </div>

        {/* Team 2 Area */}
        <div className="flex-1 min-h-0">
          <ScoreCard 
            teamName={teamNames[Team.Right]}
            side="right"
            score={gameState.scores[Team.Right]}
            isServing={gameState.servingTeam === Team.Right}
            serverNumber={gameState.serverNumber}
            isWinner={gameState.winner === Team.Right}
            onClick={() => handleTeamClick(Team.Right)}
            disabled={gameState.gameStatus === 'idle'}
          />
        </div>

      </main>

      {/* Bottom Controls */}
      <footer className="p-4 bg-slate-900 safe-area-bottom pb-8">
        {gameState.gameStatus === 'idle' ? (
          <Button variant="primary" onClick={startGame} className="w-full py-6 text-xl uppercase tracking-widest">
            開始比賽
          </Button>
        ) : gameState.winner ? (
          <div className="grid grid-cols-1">
             <Button variant="neutral" onClick={handleNewMatch} className="w-full py-6 text-xl">
                新比賽 (New Match)
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
             <Button 
              variant="danger" 
              onClick={handleFault}
              className="py-6 text-xl uppercase tracking-wider"
            >
              發球失誤 / 換邊
            </Button>
            <div className="text-center text-xs text-slate-500 mt-2">
              點擊發球方比分以增加分數。失誤請點擊下方按鈕。
            </div>
          </div>
        )}
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        winningScore={gameState.matchSettings.winningScore}
        setWinningScore={(s) => setGameState(prev => ({
          ...prev, 
          matchSettings: { ...prev.matchSettings, winningScore: s }
        }))}
        teamNames={teamNames}
        setTeamName={(team, name) => setGameState(prev => ({
          ...prev,
          matchSettings: {
            ...prev.matchSettings,
            teamNames: {
              ...prev.matchSettings.teamNames,
              [team]: name
            }
          }
        }))}
      />

      <MatchHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={matchRecords}
        onClearHistory={() => setMatchRecords([])}
      />
      
    </div>
  );
}