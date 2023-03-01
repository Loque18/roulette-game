import { GameState } from '../../models/game-state';
import { State } from '../../state-machine/state';
import { RouletteStateContext } from '../../state-machine/state-context';
import { StateProps } from '../../state-machine/state-props';

import { rouletteContstants } from '../contants';

class GameStartState extends State<RouletteStateContext> {
  props: StateProps = {
    name: GameState.GAME_START,
  };

  onEnter(context: RouletteStateContext): void {
    const { controller } = context;

    controller.restart();

    controller.updateGame();

    setTimeout(() => {
      context.controller.changeState(GameState.WAITING_FOR_BETS);
    }, 200);
  }

  update(): void {}

  onExit(): void {}
}

export { GameStartState };
