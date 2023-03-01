import { Bet } from '../../models/game-bet';
import { GameCoin } from '../../models/game-coin';
import { GameState } from '../../models/game-state';
import { State } from '../../state-machine/state';
import { RouletteStateContext } from '../../state-machine/state-context';
import { StateProps } from '../../state-machine/state-props';
import { rouletteContstants } from '../contants';

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
    const { coins } = context.getRouletteProps();

    const results: Results = this.getRoundResults(coins);

    const winningBets = this.computeWinningBets(
      context.getRouletteProps().roundValues.bets,
      results
    );

    controller.setResults(results);

    controller.setWinners(winningBets);

    setTimeout(() => {
      controller.changeState(GameState.SHOWING_RESULTS);
    }, rouletteContstants.SPIN_TIME);

    controller.updateGame();
  }

  update(context: RouletteStateContext): void {
    // spin logic
  }

  onExit(context: RouletteStateContext): void {}

  // *~~*~~*~~ self methods ~~*~~*~~* //

  private getRoundResults(coins: GameCoin[]): Results {
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

  private computeWinningBets(roundBets: Bet[], results: Results): Bet[] {
    const { winningNumber } = results;

    const c: { [key: string]: number } = {
      bronze: 1,
      silver: 2,
      gold: 3,
    };

    const winningBets = roundBets.filter((bet: Bet) => {
      return c[bet.coinType] === winningNumber;
    });

    return winningBets;
  }
}

export { SpinningState };
