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
  { id: 1, color: 'bronze' },
  { id: 2, color: 'silver' },
  { id: 3, color: 'bronze' },
  { id: 4, color: 'silver' },
  { id: 5, color: 'bronze' },
  { id: 6, color: 'silver' },
  { id: 7, color: 'bronze' },
  { id: 8, color: 'silver' },
  { id: 9, color: 'bronze' },
  { id: 10, color: 'silver' },
  { id: 11, color: 'bronze' },
  { id: 12, color: 'silver' },
  { id: 13, color: 'bronze' },
  { id: 14, color: 'silver' },
  { id: 15, color: 'gold' },
];

class RouletteGame {
  // *~~*~~*~~ private properties ~~*~~*~~* //

  private _roundValues: RouletteRound = {
    id: Math.random().toString(36).substring(7),
    listeningForBets: false,
    bets: [],
    betsHistory: [],
    spinNumber: 0,
    winningCoin: null,
    winners: [],
  };

  private roundSubject = new BehaviorSubject<RouletteRound>(this.roundValues);

  private _initialState = GameState.WAITING_FOR_BETS;
  private stateSubject = new BehaviorSubject<GameState>(this._initialState);

  // *~~*~~*~~ STREAMS ~~*~~*~~* //
  public stateStream$ = this.stateSubject.asObservable();
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
      storeBetsInHistory: () => this.storeBetsInHistory(),

      // machine handlers
      changeState: (state: GameState) => {
        this._machine.changeState(state);
        this.stateSubject.next(state);
      },

      // external
      setSpinNumber: (spinNumber: number) => {
        this.roundValues = {
          ...this._roundValues,
          spinNumber,
        };
      },

      setWinningCoin: (winningCoin: GameCoin) => {
        this.setWinningCoin(winningCoin);
      },
    },
    getRouletteProps: () => ({
      coins: this.COINS,
      roundValues: this._roundValues,
    }),
  });

  // *~~*~~*~~ public getters ~~*~~*~~* //
  // public get currentState(): GameState {}
  public get currentState(): GameState {
    return this.stateSubject.getValue();
  }

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

  private storeBetsInHistory(): void {
    const betsHistory = [...this._roundValues.betsHistory];

    // store only the last 10 bets
    if (betsHistory.length > 10) {
      betsHistory.shift();
    }

    betsHistory.push(this._roundValues.bets);

    this.roundValues = {
      ...this._roundValues,
      betsHistory,
    };
  }

  private setWinningCoin(winningCoin: GameCoin): void {
    this.roundValues = {
      ...this._roundValues,
      winningCoin,
      winners: this._roundValues.bets.filter((bet: Bet) => {
        return bet.coinType === winningCoin.color;
      }),
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
