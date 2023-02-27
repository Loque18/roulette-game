import { State } from './state';

class StateMachine<contextT> {
  private _currentState: State<contextT> | undefined;

  constructor(
    private _states: { [stateName: string]: State<contextT> },
    protected _context: contextT
  ) {}

  changeState(stateName: string): void {
    const currentState = this._currentState;
    const targetState = this._states[stateName];

    if (currentState !== undefined) {
      currentState.onExit(this._context);
    }

    this._currentState = targetState;

    targetState.onEnter(this._context);
  }

  update(): void {
    if (this._currentState !== undefined) {
      this._currentState.update(this._context);
    }
  }

  get currentStateName(): string {
    return this._currentState?.props.name as string;
  }
}

export { StateMachine };
