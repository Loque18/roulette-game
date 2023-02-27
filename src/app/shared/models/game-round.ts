import { Bet } from './game-bet';
import { GameCoin } from './game-coin';
import { Player } from './game-player';

type RouletteRound = {
  id: string;
  listeningForBets: boolean;
  bets: Bet[];
  betsHistory: Bet[][];
  spinNumber: number;
  winningCoin: GameCoin | null;
  winners: Bet[];
};

export { RouletteRound };
