import { GameState } from '../models/game-state';
import { WaitingForBetsState } from './states/waiting-for-bets-state';
import { SpinningState } from './states/spin-state';
import { ResultsState } from './states/results-state';
import { StateMachine } from '../state-machine/state-machine';
import { GameCoin } from '../models/game-coin';
import { RouletteStateContext } from '../state-machine/state-context';
import { BehaviorSubject } from 'rxjs';
import { Bet } from '../models/game-bet';

import { RouletteRound } from '../models/game-round';

const GAME_COINS: GameCoin[] = [
  { id: 1, color: 'bronze', value: 1 },
  { id: 2, color: 'silver', value: 2 },
  { id: 3, color: 'bronze', value: 1 },
  { id: 4, color: 'silver', value: 2 },
  { id: 5, color: 'bronze', value: 1 },
  { id: 6, color: 'silver', value: 2 },
  { id: 7, color: 'bronze', value: 1 },
  { id: 8, color: 'silver', value: 2 },
  { id: 9, color: 'bronze', value: 1 },
  { id: 10, color: 'silver', value: 2 },
  { id: 11, color: 'bronze', value: 1 },
  { id: 12, color: 'silver', value: 2 },
  { id: 13, color: 'bronze', value: 1 },
  { id: 14, color: 'silver', value: 2 },
  { id: 15, color: 'gold', value: 3 },
];

class RouletteGame {
  constructor() {
    this.roundSubject.next(this._roundValues);
  }

  // *~~*~~*~~ private properties ~~*~~*~~* //

  private _initialState = GameState.WAITING_FOR_BETS;

  private _roundValues: RouletteRound = {
    id: Math.random().toString(36).substring(7),
    state: this._initialState,
    listeningForBets: false,
    bets: [],
    history: [],
    spinNumber: null,
    randomNumber: null,
    winningCoin: null,
    winners: [],
  };

  private roundSubject = new BehaviorSubject<RouletteRound>(this.roundValues);

  // *~~*~~*~~ STREAMS ~~*~~*~~* //
  public roundStream$ = this.roundSubject.asObservable();

  // *~~*~~*~~ Constants ~~*~~*~~* //
  readonly COINS: GameCoin[] = GAME_COINS;

  // *~~*~~*~~ State machine ~~*~~*~~* //
  private _states = {
    [GameState.WAITING_FOR_BETS]: new WaitingForBetsState(),
    [GameState.SPINNING]: new SpinningState(),
    [GameState.SHOWING_RESULTS]: new ResultsState(),
  };

  private _machine = new StateMachine<RouletteStateContext>(this._states, {
    controller: {
      // internal

      //bets handlers
      openBets: () => this.openBets(),
      closeBets: () => this.closeBets(),
      resetBets: () => this.resetBets(),
      // storeBetsInHistory: () => this.storeRoundInHistory(),

      // machine handlers
      changeState: (state: GameState) => {
        this._machine.changeState(state);

        this.roundValues = {
          ...this._roundValues,
          state,
        };
      },

      setResults: (results: any) => {
        // this.roundValues = {
        //   ...this._roundValues,
        //   randomNumber: results.randomNumber,
        //   winningCoin: results.winningCoin,
        // };
      },
    },

    getRouletteProps: () => ({
      coins: this.COINS,
      roundValues: this._roundValues,
    }),
  });

  // *~~*~~*~~ public getters & setters ~~*~~*~~* //

  // public get round(): Readonly<RouletteRound> {
  //   return this._roundValues;
  // }

  private set roundValues(roundValues: RouletteRound) {
    this._roundValues = roundValues;
    this.roundSubject.next(this._roundValues);
  }

  // *~~*~~*~~ public methods ~~*~~*~~* //

  public init(): void {
    this._machine.changeState(this._initialState);
  }

  // *~~*~~*~~ internal actions ~~*~~*~~* //

  private openBets(): void {
    this.roundValues = {
      ...this._roundValues,
      listeningForBets: true,
    };
  }

  private closeBets(): void {
    this.roundValues = {
      ...this._roundValues,
      listeningForBets: false,
    };
  }

  private resetBets(): void {
    this.roundValues = {
      ...this._roundValues,
      bets: [],
    };
  }

  private storeRoundInHistory(winningCoin: GameCoin): void {
    const history = [...this._roundValues.history];

    if (history.length > 20) {
      history.shift();
    }

    history.push(winningCoin);

    this.roundValues = {
      ...this._roundValues,
      history,
    };
  }

  // *~~*~~*~~ external actions ~~*~~*~~* //

  public placeBet(bet: Bet): void {
    if (this._roundValues.listeningForBets) {
      this.roundValues = {
        ...this._roundValues,
        bets: [...this._roundValues.bets, bet],
      };
    }
  }
}

export { RouletteGame };
