class Deck {
    constructor() {
        this.cards = [];

        let suits = ["hearts", "clubs", "spades", "diamonds"];
        let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "ten", "jack", "queen", "king", "ace"];
        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }
    }

    pickCard(rank, suit) {
        if (this.cards.length === 0) return new Card("none", "none");
        if (!rank && !suit) {
            return this.cards.splice(floor(random(this.cards.length)), 1)[0];
        } else {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].equals(rank, suit)) {
                    return this.cards.splice(i, 1)[0];
                }
            }
        }
    }

    size() {
        return this.cards.length;
    }
}