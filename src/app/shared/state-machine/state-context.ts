import { RouletteController } from '../games/roulette-controller';
import { Bet } from '../models/game-bet';
import { GameCoin } from '../models/game-coin';
import { RouletteRound } from '../models/game-round';
import { GameState } from '../models/game-state';

type RouletteStateContext = {
  controller: {
    //bets handlers
    openBets: () => void;
    closeBets: () => void;
    resetBets: () => void;
    storeBetsInHistory: () => void;

    // machine handlers
    changeState: (stateName: GameState) => void;

    // external
    setSpinNumber: (spinNumber: number) => void;
    setWinningCoin: (winningCoin: GameCoin) => void;
  };

  getRouletteProps: () => {
    coins: GameCoin[];
    roundValues: RouletteRound;
  };
};

export { RouletteStateContext };
