import { GameState } from '../../models/game-state';
import { State } from '../../state-machine/state';
import { RouletteStateContext } from '../../state-machine/state-context';
import { StateProps } from '../../state-machine/state-props';
import { rouletteContstants } from '../contants';

// private showResults(WinningCoin: GameCoin) {
//   this._gameState.next(GameState.SHOWING_RESULTS);
//   // select winners
//   // get last bets from the history
//   const latestBets = this.betsHistory[this.betsHistory.length - 1];
//   // filter bets by winning coin
//   const winnerBets = latestBets.filter(
//     (bet: Bet) => bet.coinType === WinningCoin.color
//   );
//   // Stream winners
//   this.winners.next(winnerBets);
//   setTimeout(() => {
//     this.waitForBets();
//   }, RESULTS_TIME);
// }

class ResultsState extends State<RouletteStateContext> {
  props: StateProps = {
    name: GameState.SHOWING_RESULTS,
  };

  onEnter(context: RouletteStateContext): void {
    const { controller } = context;

    const { coins, roundValues } = context.getRouletteProps();

    setTimeout(() => {
      controller.changeState(GameState.GAME_START);
    }, rouletteContstants.RESULTS_TIME);

    controller.updateGame();
  }

  update(): void {}

  onExit(): void {}
}

export { ResultsState };
