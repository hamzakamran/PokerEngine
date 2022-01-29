class Slider {
    constructor(x, y, w, min, max) {
        this.pos = createVector(x, y);
        this.width = w;
        this.range = createVector(min, max);
        this.btnPos = createVector(this.pos.x + 40, this.pos.y);
        this.btnSize = createVector(40, 30);
        this.sliderHover = false;
        this.sliderDown = false;
        this.value = smallBlind;
        this.decreaseBtn = new Button(
            "-",
            this.pos.x, this.pos.y,
            40, 40,
            color(255, 120), color(0),
            false
        );
        this.increaseBtn = new Button(
            "+",
            this.pos.x + this.width, this.pos.y,
            40, 40,
            color(255, 120), color(0),
            false
        );
    }

    updateRange(min, max) {
        this.range.x = min;
        this.range.y = max;
    }

    reset() {
        this.btnPos.x = this.pos.x + 40;
        this.value = floor(map(
            this.btnPos.x,
            this.pos.x + 40, this.pos.x + this.width - 40,
            this.range.x, this.range.y
        ) / smallBlind) * smallBlind;
        if (this.value === 0) {
            this.value = smallBlind;
        }
    }

    decreaseClick() {
        return this.decreaseBtn.click();
    }

    increasedClick() {
        return this.increaseBtn.click();
    }

    pressed() {
        if (this.sliderHover) {
            this.sliderDown = true;
        }
    }

    released() {
        this.sliderDown = false;
    }

    drag() {
        if (this.sliderDown) {
            this.btnPos.x = constrain(mouseX, this.pos.x + 40, this.pos.x + this.width - 40);
            this.value = floor(map(
                this.btnPos.x,
                this.pos.x + 40, this.pos.x + this.width - 40,
                this.range.x, this.range.y
            ) / smallBlind) * smallBlind;
            if (this.value === 0) {
                this.value = smallBlind;
            }
        }
    }

    increaseValue() {
        let temp = this.btnPos.x + 5;
        this.btnPos.x = constrain(temp, this.pos.x + 40, this.pos.x + this.width - 40);
        this.value = floor(map(
            this.btnPos.x,
            this.pos.x + 40, this.pos.x + this.width - 40,
            this.range.x, this.range.y
        ) / smallBlind) * smallBlind;
        if (this.value === 0) {
            this.value = smallBlind;
        }
    }

    decreaseValue() {
        let temp = this.btnPos.x - 5;
        this.btnPos.x = constrain(temp, this.pos.x + 40, this.pos.x + this.width - 40);
        this.value = floor(map(
            this.btnPos.x,
            this.pos.x + 40, this.pos.x + this.width - 40,
            this.range.x, this.range.y
        ) / smallBlind) * smallBlind;
        if (this.value === 0) {
            this.value = smallBlind;
        }
    }

    draw() {
        this.sliderHover =
            mouseX > this.btnPos.x - this.btnSize.x / 2 &&
            mouseX < this.btnPos.x + this.btnSize.x / 2 &&
            mouseY > this.btnPos.y - this.btnSize.y / 2 &&
            mouseY < this.btnPos.y + this.btnSize.y / 2;
        if (this.sliderHover) {
            cursor(HAND);
        }

        this.decreaseBtn.draw();

        strokeWeight(3);
        stroke(255, 120);
        line(this.pos.x + 40, this.pos.y, this.pos.x + this.width - 40, this.pos.y);

        noStroke();
        fill(220);
        rectMode(CENTER);
        rect(this.btnPos.x, this.btnPos.y, this.btnSize.x, this.btnSize.y, this.btnSize.y);
        rectMode(CORNER);
        strokeWeight(2);
        stroke(180);
        line(
            this.btnPos.x - 3, this.btnPos.y - (this.btnSize.y / 2 - 10),
            this.btnPos.x - 3, this.btnPos.y + (this.btnSize.y / 2 - 10)
        );
        line(
            this.btnPos.x + 3, this.btnPos.y - (this.btnSize.y / 2 - 10),
            this.btnPos.x + 3, this.btnPos.y + (this.btnSize.y / 2 - 10)
        );

        this.increaseBtn.draw();
    }

    toString() {
        if (!this.value) {
            return "$" + smallBlind;
        }
        return "$" + this.value;
    }
}