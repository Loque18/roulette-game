import { Bet } from '../models/game-bet';
import { GameCoin } from '../models/game-coin';
import { RouletteRound } from '../models/game-round';
import { GameState } from '../models/game-state';

type Results = {
  randomNumber: number;
  spinNumber: number;
  winningNumber: number;
};

type RouletteStateContext = {
  controller: {
    //bets handlers
    openBets: () => void;
    closeBets: () => void;
    resetBets: () => void;
    storeInHistory: (coin: GameCoin) => void;
    // storeBetsInHistory: () => void;

    // machine handlers
    changeState: (stateName: GameState) => void;

    setResults: (results: Results) => void;

    setWinners: (winnners: Bet[]) => void;

    restart: () => void;

    // stream
    updateGame: () => void;
  };

  getRouletteProps: () => {
    coins: GameCoin[];
    roundValues: RouletteRound;
  };
};

export { RouletteStateContext };
