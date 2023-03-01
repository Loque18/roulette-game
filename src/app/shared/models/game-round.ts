import { Bet } from './game-bet';
import { GameCoin } from './game-coin';
import { GameState } from './game-state';

type RouletteRound = {
  id: string;
  state: GameState;

  bets: Bet[];
  history: GameCoin[];

  spinNumber: number | null;
  randomNumber: number | null;
  winningNumber: number | null;

  startTime: string;
  endTime: string;

  // winners: Bet[];
};

export { RouletteRound };
