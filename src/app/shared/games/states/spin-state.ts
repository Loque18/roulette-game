import { GameState } from '../../models/game-state';
import { State } from '../../state-machine/state';
import { RouletteStateContext } from '../../state-machine/state-context';
import { StateProps } from '../../state-machine/state-props';

class SpinningState extends State<RouletteStateContext> {
  props: StateProps = {
    name: GameState.SPINNING,
  };

  onEnter(context: RouletteStateContext): void {
    const { controller } = context;

    // get latests bets
    const { coins, roundValues } = context.getRouletteProps();

    const { bets } = roundValues;

    controller.storeBetsInHistory();

    const spin = Math.floor(Math.random() * 20) + 20;
    controller.setSpinNumber(spin);
    // this._gameSpin.next(spin);

    // shift array {{spin}} times
    // [b] [s] [g]
    // [s] [g] [b]
    // [g] [b] [s]
    // [b] [s] [g]

    const ShiftedCoins = coins.map((coin, index) => {
      const newIndex = (index + spin) % coins.length;
      return coins[newIndex];
    });

    // winning coin is the first one
    const WinningCoin = ShiftedCoins[0];

    controller.setWinningCoin(WinningCoin);

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
}

export { SpinningState };
