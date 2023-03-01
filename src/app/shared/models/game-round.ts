import { Bet } from './game-bet';
import { GameCoin } from './game-coin';
import { GameState } from './game-state';

type RouletteRound = {
  id: string;
  state: GameState;
  listeningForBets: boolean;
  bets: Bet[];
  history: GameCoin[];
  spinNumber: number | null;
  randomNumber: number | null;
  winningCoin: GameCoin | null;
  winners: Bet[];
};

export { RouletteRound };
