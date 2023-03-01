import { Injectable } from '@angular/core';

import { GameCoin } from '../models/game-coin';

import { RouletteGame } from '../games/roulette-game';
import { GameState } from '../models/game-state';
import { RouletteRound } from '../models/game-round';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // *~~*~~*~~ Game Logic ~~*~~*~~* //

  private _rouletteGame: RouletteGame = new RouletteGame();

  private _round: RouletteRound = this._rouletteGame.getActiveGame();

  // *~~*~~*~~ Streams ~~*~~*~~* //

  public roundGameUpdate$ = this._rouletteGame.roundStream$;

  constructor() {
    this._round = this._rouletteGame.getActiveGame();
    this.roundGameUpdate$.subscribe((r: RouletteRound) => {
      this._round = r;
    });
  }

  // *~~*~~*~~ getters ~~*~~*~~* //
  get coins(): GameCoin[] {
    return this._rouletteGame.COINS;
  }

  get round(): Readonly<RouletteRound> {
    return this._round;
  }

  // *~~*~~*~~ Game API ~~*~~*~~* //

  placeBet(bet: any): void {
    this._rouletteGame.placeBet(bet);
  }
}
