import { GameState, Team } from '../types';

export const INITIAL_STATE: GameState = {
  scores: {
    [Team.Left]: 0,
    [Team.Right]: 0,
  },
  servingTeam: Team.Left, // Usually starts right side (from perspective) but we default left for UI
  serverNumber: 2, // Standard start: 0-0-2
  gameStatus: 'idle',
  winner: null,
  history: [],
  matchSettings: {
    winningScore: 11,
    winByTwo: true,
    teamNames: {
      [Team.Left]: "我方",
      [Team.Right]: "對手"
    }
  },
};

export const checkWinCondition = (state: GameState): Team | null => {
  const { scores, matchSettings } = state;
  const left = scores[Team.Left];
  const right = scores[Team.Right];
  const target = matchSettings.winningScore;

  if (left >= target && (!matchSettings.winByTwo || left >= right + 2)) {
    return Team.Left;
  }
  if (right >= target && (!matchSettings.winByTwo || right >= left + 2)) {
    return Team.Right;
  }
  return null;
};

export const createSnapshot = (state: GameState): GameState['history'][0] => ({
  scores: { ...state.scores },
  servingTeam: state.servingTeam,
  serverNumber: state.serverNumber,
  timestamp: Date.now(),
});