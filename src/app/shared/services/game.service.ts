import { Injectable } from '@angular/core';

import { GameCoin } from '../models/game-coin';

import { RouletteGame } from '../games/roulette-game';
import { GameState } from '../models/game-state';
import { RouletteRound } from '../models/game-round';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // *~~*~~*~~ Game Logic ~~*~~*~~* //

  private _rouletteGame: RouletteGame = new RouletteGame();

  // *~~*~~*~~ Streams ~~*~~*~~* //
  public onStateChange = this._rouletteGame.stateStream$;

  public onRoundUpdate = this._rouletteGame.roundStream$;

  private roundValues: RouletteRound = {
    id: 'null',
    listeningForBets: false,
    bets: [],
    betsHistory: [],
    spinNumber: 0,
    winningCoin: null,
    winners: [],
  };

  constructor() {
    // this._rouletteGame.init();
    // this.onRoundUpdate.subscribe((round: RouletteRound) => {
    //   this.roundValues = round;
    // });
  }

  // *~~*~~*~~ getters ~~*~~*~~* //
  get coins(): GameCoin[] {
    return this._rouletteGame.COINS;
  }

  get gameState(): GameState {
    return this._rouletteGame.currentState;
  }

  get round(): RouletteRound {
    return this.roundValues;
  }

  // *~~*~~*~~ Game API ~~*~~*~~* //

  placeBet(bet: any): void {
    this._rouletteGame.placeBet(bet);
  }
}
