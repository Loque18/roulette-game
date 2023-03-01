import { GameCoin } from '../../models/game-coin';
import { GameState } from '../../models/game-state';
import { State } from '../../state-machine/state';
import { RouletteStateContext } from '../../state-machine/state-context';
import { StateProps } from '../../state-machine/state-props';

type Results = {
  randomNumber: number;
  spinNumber: number;
  winningNumber: number;
};

/**
 *
 * shift array {{spin}} times
 * [b] [s] [b] [s] [b] [G]
 * [s] [b] [s] [b] [G] [b]
 * [b] [s] [b] [G] [b] [s]
 *
 * [s] [b] [G] [b] [s] [b]
 */

class SpinningState extends State<RouletteStateContext> {
  props: StateProps = {
    name: GameState.SPINNING,
  };

  onEnter(context: RouletteStateContext): void {
    const { controller } = context;

    // get latests bets
    const { coins, roundValues } = context.getRouletteProps();

    const { bets } = roundValues;

    // controller.storeBetsInHistory();

    const results: Results = this.getRoundValues(coins);

    controller.setResults(results);

    setTimeout(() => {
      controller.changeState(GameState.SHOWING_RESULTS);
    }, 2000);
  }

  update(context: RouletteStateContext): void {
    // spin logic
  }

  onExit(context: RouletteStateContext): void {
    const { controller } = context;

    controller.resetBets();
  }

  // *~~*~~*~~ self methods ~~*~~*~~* //

  private getRoundValues(coins: GameCoin[]): Results {
    const randomNumber = Math.floor(Math.random() * 9);
    const spinNumber = Math.floor(Math.random() * 14) + 0;
    const winningCoinIndex = (randomNumber + spinNumber) % 15;
    const winningNumber = coins[winningCoinIndex].value;

    return {
      randomNumber,
      spinNumber,
      winningNumber,
    };
  }
}

export { SpinningState };
