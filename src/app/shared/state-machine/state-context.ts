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
