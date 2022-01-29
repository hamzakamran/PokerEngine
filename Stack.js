class Stack {
    constructor(amt = 0) {
        this.amount = amt;
    }

    give(other, amt) {
        if (this.amount - amt >= 0) {
            this.amount -= amt;
            other.amount += amt;
        } else {
            return false;
        }
    }

    toString() {
        return "$" + this.amount;
    }
}