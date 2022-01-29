class Player {
    constructor(name, x, y) {
        this.name = name;
        this.pos = createVector(x, y);
        this.holeCards = [];
        this.stack = new Stack(INITIAL_STACK_SIZE);
        this.betSize = new Stack();
        this.hasDealerBtn = false;
        this.difficulty = "dummy";
        this.message = "";
        this.hasFolded = false;
        this.hasPlayed = false;
        this.callAmt;
        this.raiseAmt;
        this.slider;
        this.foldBtn = new Button(
            "   Fold",
            width / 2 - 200, height - 150, 150, 40,
            color(0, 120),
            color(255),
            false,
            foldIcon
        );
        this.callBtn = new Button(
            "   Call",
            width / 2, height - 150, 150, 40,
            color(0, 120),
            color(255),
            false,
            checkIcon
        );
        this.checkBtn = new Button(
            "   Check",
            width / 2, height - 150, 150, 40,
            color(0, 120),
            color(255),
            false,
            checkIcon
        );
        this.raiseBtn = new Button(
            "   Raise",
            width / 2 + 200, height - 150, 150, 40,
            color(0, 120),
            color(255),
            false,
            raiseIcon
        );
        if (this.name.toLowerCase() === "player") {
            this.slider = new Slider(
                width / 2 - 255, height - 90, 310,
                smallBlind, this.stack.amount
            );
        }
    }

    reset() {
        this.hasFolded = false;
        this.hasDealerBtn = false;
        this.holeCards = [];
    }

    giveCard(card) {
        if (this.name.toLowerCase() === "bot") {
            card.showing = false;
        }
        if (this.holeCards.length < 2) {
            this.holeCards.push(card);
        }
    }

    showCards() {
        for (let card of this.holeCards) {
            card.show();
        }
    }

    draw() {
        if (this.name.toLowerCase() === "player") {
            if (this.stack.amount < smallBlind) {
                this.slider.updateRange(0, this.stack.amount);
            } else {
                this.slider.updateRange(smallBlind, this.stack.amount);
            }
        }
        for (let i = 0; i < this.holeCards.length; i++) {
            this.holeCards[i].draw(this.pos.x - 30 + i * 60, this.pos.y - 58, 0.8);
        }
        textBubble(this.pos.x, this.pos.y, 180, 40, this.stack.toString(), color(255), color(0));
        if (this.hasDealerBtn) {
            noStroke();
            fill(178, 190, 195);
            ellipse(this.pos.x - 115, this.pos.y - 30, 35, 35);
            textAlign(CENTER, CENTER);
            textSize(22);
            fill(0);
            text("D", this.pos.x - 114, this.pos.y - 29);
        }
        if (this.betSize.amount > 0) {
            textBubble(
                this.pos.x + 150, this.pos.y - 30, 100, 25,
                this.betSize.toString(),
                color(0, 120), color(255),
                false
            );
        }
        if (this.message.length > 0) {
            textBubble(
                this.pos.x + 150, this.pos.y, 100, 25,
                this.message,
                color(255), color(0),
                false
            );
        }
    }

    drawGui() {
        noStroke();
        fill(0, 80);
        rectMode(CORNER);
        rect(0, height - 200, width, 200);

        this.foldBtn.draw();
        if (betToMatch - this.betSize.amount === 0) {
            this.checkBtn.draw();
        } else {
            this.callBtn.draw();
        }
        this.raiseBtn.draw();

        this.slider.draw();

        strokeWeight(2);
        stroke(255);
        fill(220, 120);
        rect(width / 2 + 200, height - 90, 150, 40, 12);
        textAlign(RIGHT, CENTER);
        noStroke();
        fill(255);
        text(this.slider.toString(), width / 2 + 270, height - 90);
    }

    print(name) {
        console.log(name + ": ");
        if (this.hasDealerBtn) {
            console.log("Dealer Button");
        }
        console.log("Stack size: ", this.stack.toString());
        console.log("Bet size:", this.betSize.toString());
    }

    setDifficulty(mode) {
        this.difficulty = mode;
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

    play() {
        if (this.name.toLowerCase() === "player") {
            this.callAmt = betToMatch - this.betSize.amount;
        } else {
            switch (this.difficulty) {
                case "dummy":
                    this.dummyPlay();
                    break;
                case "easy":
                    break;
                case "medium":
                    break;
                case "hard":
                    break;
                default:
                    this.difficulty = "easy";
                    break;
            }
        }
    }

    dummyPlay() {
        if (toPlay === "bot") {
            if (this.betSize.amount === betToMatch) {
                this.message = "Check";
                this.hasPlayed = true;
                toPlay = "player";
            } else if (this.betSize.amount < betToMatch) {
                this.message = "Call";
                let callAmt = betToMatch - this.betSize.amount;
                this.stack.give(this.betSize, callAmt);
                this.hasPlayed = true;
                toPlay = "player";
            }
        }
    }

    click() {
        if (this.foldBtn.click()) {
            this.hasFolded = true;
            this.hasPlayed = true;
            toPlay = "bot";
        }
        if (this.betSize.amount === betToMatch) {
            if (this.checkBtn.click()) {
                this.hasPlayed = true;
                toPlay = "bot";
            }
        } else {
            if (this.callBtn.click()) {
                this.stack.give(this.betSize, this.callAmt);
                this.hasPlayed = true;
                toPlay = "bot";
            }
        }
        if (this.raiseBtn.click()) {
            let raiseAmt = this.slider.value - this.betSize.amount;
            this.stack.give(this.betSize, raiseAmt);
            this.hasPlayed = true;
            this.slider.reset();
            betToMatch = this.betSize.amount;
            toPlay = "bot";
        }
        if (this.name.toLowerCase() === "player") {
            if (this.slider.increasedClick()) {
                this.slider.increaseValue();
            }
            if (this.slider.decreaseClick()) {
                this.slider.decreaseValue();
            }
        }
    }

    pressed() {
        if (this.name.toLowerCase() === "player") {
            this.slider.pressed();
        }
    }

    released() {
        if (this.name.toLowerCase() === "player") {
            this.slider.released();
        }
    }

    drag() {
        if (this.name.toLowerCase() === "player") {
            this.slider.drag();
        }
    }
}