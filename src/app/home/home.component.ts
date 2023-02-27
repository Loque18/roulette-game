import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GameService } from '../shared/services/game.service';

import { GameCoin } from '../shared/models/game-coin';
import { GameState } from '../shared/models/game-state';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Player } from '../shared/models/game-player';
import { Bet } from '../shared/models/game-bet';

enum Coin {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

import { RouletteGame } from '../shared/games/roulette-game';
import { RouletteRound } from '../shared/models/game-round';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  protected player: Player = new Player(
    Math.random().toString(36).substring(7),
    Math.random().toString(36).substring(7)
  );

  bets: Bet[] = [];

  protected gameCoins: GameCoin[] = this.game.coins;

  protected gameState: string = '';

  @ViewChild('coinsTrack') private coinsTrack!: ElementRef;
  protected squareWidth!: number;

  constructor(protected game: GameService) {}

  ngAfterViewInit(): void {
    // this.game.onStateChange.subscribe((state: GameState) => {
    //   if (state === GameState.SPINNING) {
    //     const spinNumber = this.game.round.spinNumber;
    //     console.log(spinNumber);
    //     this.coinsTrack.nativeElement.style.transform = `translateX(-${
    //       spinNumber / 50
    //     }%)`;
    //   }
    // });

    const elmt: HTMLElement = this.coinsTrack.nativeElement;

    const firstChild: HTMLElement = elmt.children[0] as HTMLElement;

    this.squareWidth = firstChild.offsetWidth;
  }

  rotate(): void {
    const amount = Math.random() * 1000;
    const time = 2000;

    const elmt: HTMLElement = this.coinsTrack.nativeElement;

    elmt.style.transitionDuration = '2000ms';
    elmt.style.transitionTimingFunction = 'cubic-bezier(0.12, 0.8, 0.38, 1)';
    elmt.style.transform = `translateX(-${amount}px)`;

    console.log('called');
  }

  // *~~*~~*~~ Component actions ~~*~~*~~* //

  betForm: FormGroup = new FormGroup({
    betAmount: new FormControl(0),
    betCoin: new FormControl(Coin.BRONZE),
  });

  placeBet(): void {
    // ...
    if (!this.game.round.listeningForBets) return;

    const { betAmount, betCoin } = this.betForm.value;
    const bet: Bet = {
      amount: betAmount,
      coinType: betCoin,
      playerId: this.player.id,
    };

    this.game.placeBet(bet);

    this.resetForm();
  }

  private resetForm(): void {
    this.betForm.value['betAmount'] = 0;
  }

  get coins(): GameCoin[] {
    const c: GameCoin[] = this.game.coins;

    return [...c, ...c, ...c, ...c, ...c];
  }

  get latestBets(): Bet[] {
    return this.game.round.bets;
  }

  get winners(): Bet[] {
    return this.game.round.winners;
  }
}
