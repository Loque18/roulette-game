import { GameCoin } from '../models/game-coin';
import { RouletteRound } from '../models/game-round';
import { GameState } from '../models/game-state';

type RouletteStateContext = {
  controller: {
    //bets handlers
    openBets: () => void;
    closeBets: () => void;
    resetBets: () => void;
    // storeBetsInHistory: () => void;

    // machine handlers
    changeState: (stateName: GameState) => void;

    // external
    setResults: (spinNumber: any) => void;
  };

  getRouletteProps: () => {
    coins: GameCoin[];
    roundValues: RouletteRound;
  };
};

export { RouletteStateContext };
