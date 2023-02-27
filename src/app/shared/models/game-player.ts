class Player {
  private _balance: number = 1000000;

  constructor(public id: string, public name: string) {}

  get balance() {
    return this._balance;
  }

  addFund(amount: number): void {
    this._balance += amount;
  }

  removeFund(amount: number): void {
    this._balance -= amount;
  }
}

export { Player };
