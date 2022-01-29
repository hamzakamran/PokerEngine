class Bot {
    constructor() {
        this.stack = new Stack(INITIAL_STACK_SIZE);
        this.betSize = new Stack();
        this.hasDealerBtn = false;
    }

    print(name) {
        console.log(name + ": ");
        if (this.hasDealerBtn) {
            console.log("Dealer Button");
        }
        console.log("Stack size: ", this.stack.toString());
        console.log("Bet size:", this.betSize.toString());
    }

    getStack() {
        return this.stack.amount;
    }

    setSmallBlind() {
        this.stack.give(this.betSize, smallBlind);
    }

    setBigBlind() {
        this.stack.give(this.betSize, bigBlind);
    }

    call() {

    }

    check() {

    }

    raise() {

    }

    fold() {

    }
}