class Card {
    constructor(rank, suit) {
        this.rank = rank.toLowerCase();
        this.suit = suit.toLowerCase();
        this.value = this.getValue(this.rank);
        this.showing = true;
        this.img;

        if (this.suit === "diamonds") {
            this.img = diamond;
        } else if (this.suit === "spades") {
            this.img = spade;
        } else if (this.suit === "clubs") {
            this.img = club;
        } else {
            this.img = heart;
        }
    }

    equals(rank, suit) {
        return this.rank === rank.toLowerCase() && this.suit === suit.toLowerCase();
    }

    draw(x, y, scale) {
        if (this.showing) {
            // card
            rectMode(CENTER);
            noStroke();
            fill(255);
            rect(x, y, 70 * scale, 100 * scale, 10 * scale);

            // rank
            textAlign(CENTER, CENTER);
            textSize(40 * scale);
            fill(this.suit === "hearts" || this.suit === "diamonds" ? color(231, 76, 60) : color(0));
            text(this.rank[0].toUpperCase(), x - (17 * scale), y - (28 * scale));

            // suit
            imageMode(CENTER);
            image(this.img, x + (5 * scale), y + (15 * scale), 50 * scale, 50 * scale);
        } else {
            rectMode(CENTER);
            noStroke();
            fill(87, 95, 207);
            rect(x, y, 70 * scale, 100 * scale, 10 * scale);
            fill(30, 39, 46);
            rect(x, y, 60 * scale, 90 * scale, 5 * scale);
        }
    }

    show() {
        this.showing = true;
    }

    hide() {
        this.showing = false;
    }

    getValue(r) {
        switch (r) {
            case "2":
                return 2;
            case "3":
                return 3;
            case "4":
                return 4;
            case "5":
                return 5;
            case "6":
                return 6;
            case "7":
                return 7;
            case "8":
                return 8;
            case "9":
                return 9;
            case "ten":
                return 10;
            case "jack":
                return 11;
            case "queen":
                return 12;
            case "king":
                return 13;
            case "ace":
                return 14;
            default:
                return -1;
        }
    }

    toString() {
        return this.rank + " of " + this.suit + " (" + this.value + ")";
    }
}