class Button {
    constructor(message, x, y, w, h, col, textCol, shadow = true, img = null) {
        this.message = message;
        this.pos = createVector(x, y);
        this.size = createVector(w, h);
        this.col = col;
        this.textCol = textCol;
        this.shadow = shadow;
        this.hover = false;
        this.img = img;
    }

    draw() {
        this.hover = (mouseX > this.pos.x - this.size.x / 2 &&
            mouseX < this.pos.x + this.size.x / 2 &&
            mouseY > this.pos.y - this.size.y / 2 &&
            mouseY < this.pos.y + this.size.y / 2
        );
        if (this.hover) { cursor(HAND) };
        textBubble(
            this.pos.x, this.pos.y,
            this.size.x, this.size.y,
            this.message,
            this.col, this.textCol,
            this.shadow
        );
        if (this.img != null) {
            imageMode(CENTER, CENTER);
            image(this.img, this.pos.x - this.size.x / 2 + 25, this.pos.y, 25, 25);
        }
    }

    click() {
        return this.hover;
    }
}