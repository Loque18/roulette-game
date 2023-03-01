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

  public roundValues!: RouletteRound;

  // *~~*~~*~~ Streams ~~*~~*~~* //

  public roundGameUpdate$ = this._rouletteGame.roundStream$;

  constructor() {
    this._rouletteGame.init();
    this.roundGameUpdate$.subscribe((round: RouletteRound) => {
      this.roundValues = round;
    });
  }

  // *~~*~~*~~ getters ~~*~~*~~* //
  get coins(): GameCoin[] {
    return this._rouletteGame.COINS;
  }

  get round(): RouletteRound {
    return this.roundValues;
  }

  // *~~*~~*~~ Game API ~~*~~*~~* //

  placeBet(bet: any): void {
    this._rouletteGame.placeBet(bet);
  }
}
