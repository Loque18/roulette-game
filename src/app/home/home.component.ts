import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { trigger, state, transition } from '@angular/animations';
import { GameService } from '../shared/services/game.service';

import { GameCoin } from '../shared/models/game-coin';
import { GameState } from '../shared/models/game-state';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Player } from '../shared/models/game-player';
import { Bet } from '../shared/models/game-bet';
import { RouletteRound } from '../shared/models/game-round';

enum Coin {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  // *~~*~~*~~ Injections ~~*~~*~~* //
  constructor(protected game: GameService) {}

  // *~~*~~*~~ Game updates ~~*~~*~~* //

  protected player: Player = new Player(
    Math.random().toString(36).substring(7),
    Math.random().toString(36).substring(7)
  );

  protected gameCoins: GameCoin[] = this.game.coins;

  @ViewChild('coinsTrack') private coinsTrack!: ElementRef;
  protected squareWidth!: number;

  ngAfterViewInit(): void {
    // initial state
    const elmt: HTMLElement = this.coinsTrack.nativeElement;
    const firstChild: HTMLElement = elmt.children[0] as HTMLElement;
    this.squareWidth = firstChild.offsetWidth;
    this.initialPosition();

    // subscribe to game updates
    this.game.roundGameUpdate$.subscribe((round: RouletteRound) => {
      if (round.state === GameState.SPINNING) {
        const { randomNumber, spinNumber } = round;
        this.rotate(randomNumber as number, spinNumber as number);
      }
    });
  }

  // private simulateServerResponse(): unknown {
  //   const randomNumber = Math.floor(Math.random() * 9);
  //   const spinNumber = Math.floor(Math.random() * 14) + 0;

  //   const winningIndex = (randomNumber + spinNumber) % 15;

  //   const m: { [key: string]: number } = { b: 1, s: 2, g: 3 };

  //   // prettier-ignore
  //   const arr: string[] = ['b', 's', 'b', 's', 'b', 's', 'b', 's', 'b', 's', 'b', 's', 'b', 's', 'g'];

  //   const winningCoin: string = arr[winningIndex];

  //   const winningNumber: number = m[winningCoin];

  //   return {
  //     randomNumber,
  //     winningNumber,
  //     winningIndex,
  //     spinNumber,
  //   };
  // }

  private rotate(randomNumber: number, spinNumber: number): void {
    /**
     * there are 15 coins in total, 7 b, 7s and 1g, along a track, which is repeated 7 times
     * each coin has the same odds of being selected (1/15)
     *
     * a random number is used along with the spin number to determine the winning coin
     * winning coin = random number + spin number
     *
     * after that we have the following object { randomNumber, winningNumber, spinNumber }
     *
     * then with the given values we translate the track
     *
     * the initial position is the second track
     *
     */

    const winnerIndex = (randomNumber + spinNumber) % 15;

    const track: HTMLElement = this.coinsTrack.nativeElement;

    const HALFWIDTH_CONTAINER = track.offsetWidth / 2;

    const ONE_TRACK_WIDTH = this.game.coins.length * this.squareWidth;

    const ALL_TRACKS_WIDH = this.game.coins.length * 3 * this.squareWidth;

    const OFFSET_TO_WINNING_COIN = winnerIndex * this.squareWidth;

    const s = Math.random() > 0.5 ? 1 : -1;
    const randomOffset = s * Math.floor(Math.random() * (this.squareWidth / 2));

    const temp =
      HALFWIDTH_CONTAINER -
      ONE_TRACK_WIDTH -
      ALL_TRACKS_WIDH -
      OFFSET_TO_WINNING_COIN -
      this.squareWidth / 2;

    const winningPosition = temp;

    // 3
    track.style.transitionDuration = '3s';
    track.style.transitionTimingFunction = 'cubic-bezier(0.12, 0.8, 0.38, 1)';
    track.style.transform = `translateX(${winningPosition + randomOffset}px)`;

    const moveBackToCenter = () => {
      track.style.transitionDuration = '1s';
      track.style.transitionTimingFunction = 'cubic-bezier(0.12, 0.8, 0.38, 1)';
      track.style.transform = `translateX(${winningPosition}px)`;

      track.removeEventListener('transitionend', moveBackToCenter);

      const moveBackToStart = () => {
        this.moveBackToStart(winnerIndex);

        track.removeEventListener('transitionend', moveBackToStart);
      };

      track.addEventListener('transitionend', moveBackToStart);
    };

    track.addEventListener('transitionend', moveBackToCenter);
  }

  private moveBackToStart(winningIndex: number): void {
    // var r = this.tileNumbers.length * this.tileWidth; // width of one track
    // (r +=
    //   this.tileNumbers.indexOf(parseInt(n)) * this.tileWidth +
    //   this.tileWidth / 2), // offset to winning tile + half tile
    //   (r -= Math.floor(
    //     document.querySelector('.tiles-wrapper').offsetWidth / 2
    //   )), // half with of the container
    //   (this.offsetWidth = -1 * r); // change sign
    // var o = 'transform: translate3d(' + this.offsetWidth + 'px, 0, 0);';

    const track: HTMLElement = this.coinsTrack.nativeElement;

    const ONE_TRACK_WIDTH = this.game.coins.length * this.squareWidth;
    const OFFSET_TO_WINNING_COIN =
      winningIndex * this.squareWidth + this.squareWidth / 2;
    const HALFWIDTH_CONTAINER = track.offsetWidth / 2;

    // prettier-ignore
    const temp = - (ONE_TRACK_WIDTH + OFFSET_TO_WINNING_COIN - HALFWIDTH_CONTAINER);

    track.style.transitionDuration = '0s';
    track.style.transitionTimingFunction = 'unset';
    track.style.transform = `translateX(${temp}px)`;
  }

  private initialPosition(): void {
    this.moveBackToStart(0);
  }

  // *~~*~~*~~ Component actions ~~*~~*~~* //

  bets: Bet[] = [];

  betForm: FormGroup = new FormGroup({
    betAmount: new FormControl(0),
    betCoin: new FormControl(Coin.BRONZE),
  });

  placeBet(): void {
    // ...
    if (this.game.round.state !== GameState.WAITING_FOR_BETS) return;

    const { betAmount, betCoin } = this.betForm.value;
    const bet: Bet = {
      amount: betAmount,
      coinType: betCoin,
      player: this.player,
    };

    this.game.placeBet(bet);

    this.resetForm();
  }

  private resetForm(): void {
    this.betForm.value['betAmount'] = 0;
  }

  get coinsTracks(): GameCoin[] {
    const c: GameCoin[] = this.game.coins;

    return [...c, ...c, ...c, ...c, ...c, ...c, ...c];
  }

  get gameBets(): Bet[] {
    return this.game.round.bets;
  }

  // get winners(): Bet[] {
  //   return this.game.round.winners;
  // }
}
