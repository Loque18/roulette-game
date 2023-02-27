import { GameState } from '../../models/game-state';
import { State } from '../../state-machine/state';
import { RouletteStateContext } from '../../state-machine/state-context';
import { StateProps } from '../../state-machine/state-props';

import { rouletteContstants } from '../contants';

class WaitingForBetsState extends State<RouletteStateContext> {
  props: StateProps = {
    name: GameState.WAITING_FOR_BETS,
  };

  onEnter(context: RouletteStateContext): void {
    context.controller.openBets();

    setTimeout(() => {
      context.controller.changeState(GameState.SPINNING);
    }, rouletteContstants.BETTING_TIME);
  }

  update(): void {}

  onExit(context: RouletteStateContext): void {
    context.controller.closeBets();
  }
}

export { WaitingForBetsState };
