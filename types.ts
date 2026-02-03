export enum Team {
  Left = 'left',
  Right = 'right',
}

export interface GameState {
  scores: {
    [Team.Left]: number;
    [Team.Right]: number;
  };
  servingTeam: Team;
  serverNumber: 1 | 2;
  gameStatus: 'idle' | 'playing' | 'finished';
  winner: Team | null;
  history: GameStateSnapshot[];
  matchSettings: {
    winningScore: number;
    winByTwo: boolean;
    teamNames: {
      [Team.Left]: string;
      [Team.Right]: string;
    };
  };
}

export interface GameStateSnapshot {
  scores: {
    [Team.Left]: number;
    [Team.Right]: number;
  };
  servingTeam: Team;
  serverNumber: 1 | 2;
  timestamp: number;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  teamNames: {
    [Team.Left]: string;
    [Team.Right]: string;
  };
  finalScores: {
    [Team.Left]: number;
    [Team.Right]: number;
  };
  winner: Team;
  timeline: GameStateSnapshot[];
}