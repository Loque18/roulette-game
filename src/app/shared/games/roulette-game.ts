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

import { rouletteContstants } from './contants';
import { GameStartState } from './states/start-state';

class RoundFactory {
  static createRound(_history: GameCoin[] | null = null): RouletteRound {
    const now = new Date().getTime();

    const totalGameTime =
      rouletteContstants.BETTING_TIME +
      rouletteContstants.SPIN_TIME +
      rouletteContstants.RESULTS_TIME;

    const predictedEndOfRounnd_ms = now + totalGameTime;

    return {
      id: Math.random().toString(36).substring(7),
      state: GameState.GAME_START,

      bets: [],
      history: _history ? _history : [],

      spinNumber: null,
      randomNumber: null,
      winningNumber: null,

      startTime: now.toString(),
      endTime: predictedEndOfRounnd_ms.toString(),

      winners: [],
    };
  }
}

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
    this.init();
  }

  // *~~*~~*~~ private properties ~~*~~*~~* //

  private _initialState = GameState.GAME_START;

  private _roundValues: RouletteRound = RoundFactory.createRound();

  private takingBets = false;

  private roundSubject = new BehaviorSubject<RouletteRound>(this._roundValues);

  // *~~*~~*~~ STREAMS ~~*~~*~~* //
  public roundStream$ = this.roundSubject.asObservable();

  // *~~*~~*~~ Constants ~~*~~*~~* //
  readonly COINS: GameCoin[] = GAME_COINS;

  // *~~*~~*~~ State machine ~~*~~*~~* //
  private _states = {
    [GameState.GAME_START]: new GameStartState(),
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
      storeInHistory: (coin) => this.storeRoundInHistory(coin),
      // storeBetsInHistory: () => this.storeRoundInHistory(),

      // machine handlers
      changeState: (state: GameState) => {
        this.roundValues = {
          ...this._roundValues,
          state,
        };

        this._machine.changeState(state);
      },

      setResults: (results) => {
        const { winningNumber, randomNumber, spinNumber } = results;

        this.roundValues = {
          ...this._roundValues,
          randomNumber,
          spinNumber,
          winningNumber,
        };
      },

      setWinners: (winners: Bet[]) => {
        this.roundValues = {
          ...this._roundValues,
          winners,
        };
      },

      restart: () => {
        this.roundValues = RoundFactory.createRound(this._roundValues.history);
      },

      updateGame: () => this.updateRound(),
    },

    getRouletteProps: () => ({
      coins: this.COINS,
      roundValues: this._roundValues,
    }),
  });

  // *~~*~~*~~ public getters & setters ~~*~~*~~* //

  private set roundValues(roundValues: RouletteRound) {
    this._roundValues = roundValues;
  }

  public getActiveGame(): Readonly<RouletteRound> {
    return this._roundValues;
  }

  // *~~*~~*~~ public methods ~~*~~*~~* //

  public init(): void {
    this._machine.changeState(this._initialState);
  }

  // *~~*~~*~~ internal actions ~~*~~*~~* //

  private openBets(): void {
    this.takingBets = true;
  }

  private closeBets(): void {
    this.takingBets = false;
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

  private updateRound(): void {
    console.log('updating round', this._roundValues);

    this.roundSubject.next(this._roundValues);
  }

  // *~~*~~*~~ external actions ~~*~~*~~* //

  public placeBet(bet: Bet): void {
    if (this.takingBets) {
      this.roundValues = {
        ...this._roundValues,
        bets: [...this._roundValues.bets, bet],
      };
    } else throw new Error('Game is not accepting bets right now');
  }
}

export { RouletteGame };
