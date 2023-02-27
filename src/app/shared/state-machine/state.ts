import { StateProps } from './state-props';

abstract class State<ContextT> {
  abstract props: StateProps;

  abstract onEnter(context?: ContextT): void;
  abstract update(context?: ContextT): void;
  abstract onExit(context?: ContextT): void;
}

export { State };
