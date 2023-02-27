import { RouletteProperties } from './game-props';

class RouletteController {
  constructor(private _props: RouletteProperties) {}

  // *~~*~~*~~ internal actions ~~*~~*~~* //
  public openBets() {
    this._props.listeningForBets = true;
  }

  public closeBets() {
    this._props.listeningForBets = false;
  }

  public resetBets() {}

  public spin() {}
}

export { RouletteController };
