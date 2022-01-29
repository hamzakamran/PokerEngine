let INITIAL_STACK_SIZE = 10000;
let tableColor;

let player1 = [],
    player2 = [],
    player3 = [];

/* DO NOT MODIFY */
let deck;
let human, bot;
let communityCards;
let dealerPos;
let smallBlind, bigBlind;
let toPlay, betToMatch;
let totalPot;
let chip;
let foldIcon, checkIcon, raiseIcon;
let heart, spade, diamond, club;
let stage;
let page = "play";
let message = "";

function preload() {
    loadImages();
}

function setup() {
    // set canvas size
    createCanvas(windowWidth, windowHeight);

    // init vars
    deck = new Deck();
    communityCards = [];
    totalPot = new Stack();
    tableColor = color(109, 33, 79);
    player = new Player("Player", width / 2, height / 2 + 120);
    bot = new Player("Bot", width / 2, height / 2 - 280);
    dealerPos = (random(1) > 0.5) ? "player" : "bot";
    smallBlind = 50;
    bigBlind = 100;
    // initializeRound();
    betToMatch = (player.betSize.amount > bot.betSize.amount) ? player.betSize.amount : bot.betSize.amount;

    stage = "showdown";
    communityCards.push(deck.pickCard("Ace", "Hearts"));
    communityCards.push(deck.pickCard("3", "Spades"));
    communityCards.push(deck.pickCard("3", "Clubs"));
    communityCards.push(deck.pickCard("4", "Hearts"));
    communityCards.push(deck.pickCard("5", "Clubs"));

    player1.push(deck.pickCard("Ace", "Diamonds"));
    player1.push(deck.pickCard("Ten", "Diamonds"));

    player2.push(deck.pickCard("6", "Clubs"));
    player2.push(deck.pickCard("9", "Clubs"));

    player3.push(deck.pickCard("King", "Diamonds"));
    player3.push(deck.pickCard("King", "Clubs"));

    console.log(determineWinningHand(communityCards, [player1, player2, player3]));

    noLoop();
}

function draw() {
    cursor(ARROW);
    switch (page) {
        case "home":
            break;
        case "play":
            background(tableColor);
            // draw table
            drawTable();

            // draw players
            // player.draw();
            // player.drawGui();
            // bot.draw();

            player1[0].draw(width / 2 - 250, height - 300, 0.8);
            player1[1].draw(width / 2 - 190, height - 300, 0.8);

            player2[0].draw(width / 2 + 190, height - 300, 0.8);
            player2[1].draw(width / 2 + 250, height - 300, 0.8);

            player3[0].draw(width / 2 - 30, 100, 0.8);
            player3[1].draw(width / 2 + 30, 100, 0.8);

            noStroke();
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(24);
            text("Player 3", width / 2, 30);
            text("Player 2", width / 2 - 225, height - 230);
            text("Player 1", width / 2 + 225, height - 230);

            // play
            if (toPlay === "player") {
                player.play();
                message = "Player's turn.";
            } else {
                bot.play();
                message = "Bot's turn...";
            }

            // find bet size
            betToMatch = (player.betSize.amount > bot.betSize.amount) ? player.betSize.amount : bot.betSize.amount;

            // check for folds 
            if (player.hasFolded) {
                // give pot to bot
                player.betSize.give(totalPot, player.betSize.amount);
                bot.betSize.give(totalPot, bot.betSize.amount);
                totalPot.give(bot.stack, totalPot.amount);
                // reset round
                // initializeRound();
            }
            if (bot.hasFolded) {
                // give pot to player
                player.betSize.give(totalPot, player.betSize.amount);
                bot.betSize.give(totalPot, bot.betSize.amount);
                totalPot.give(player.stack, totalPot.amount);
                // reset round
                initializeRound();
            }

            // check on round
            if (stage === "pre-flop") {
                if (player.hasPlayed && bot.hasPlayed && player.betSize.amount === bot.betSize.amount) {
                    player.betSize.give(totalPot, player.betSize.amount);
                    bot.betSize.give(totalPot, bot.betSize.amount);
                    player.hasPlayed = false;
                    bot.hasPlayed = false;
                    player.message = "";
                    bot.message = "";
                    toPlay = (player.hasDealerBtn) ? "bot" : "player";
                    betToMatch = 0;
                    stage = "flop";
                }
            } else if (stage === "flop") {
                if (communityCards.length < 3) {
                    communityCards.push(deck.pickCard());
                }
                if (player.hasPlayed && bot.hasPlayed && player.betSize.amount === bot.betSize.amount) {
                    player.betSize.give(totalPot, player.betSize.amount);
                    bot.betSize.give(totalPot, bot.betSize.amount);
                    player.hasPlayed = false;
                    bot.hasPlayed = false;
                    player.message = "";
                    bot.message = "";
                    toPlay = (player.hasDealerBtn) ? "bot" : "player";
                    betToMatch = 0;
                    stage = "turn";
                }
            } else if (stage === "turn") {
                if (communityCards.length < 4) {
                    communityCards.push(deck.pickCard());
                }
                if (player.hasPlayed && bot.hasPlayed && player.betSize.amount === bot.betSize.amount) {
                    player.betSize.give(totalPot, player.betSize.amount);
                    bot.betSize.give(totalPot, bot.betSize.amount);
                    player.hasPlayed = false;
                    bot.hasPlayed = false;
                    player.message = "";
                    bot.message = "";
                    toPlay = (player.hasDealerBtn) ? "bot" : "player";
                    betToMatch = 0;
                    stage = "river";
                }
            } else if (stage === "river") {
                if (communityCards.length < 5) {
                    communityCards.push(deck.pickCard());
                }
                if (player.hasPlayed && bot.hasPlayed && player.betSize.amount === bot.betSize.amount) {
                    player.betSize.give(totalPot, player.betSize.amount);
                    bot.betSize.give(totalPot, bot.betSize.amount);
                    player.hasPlayed = false;
                    bot.hasPlayed = false;
                    player.message = "";
                    bot.message = "";
                    toPlay = (player.hasDealerBtn) ? "bot" : "player";
                    betToMatch = 0;
                    stage = "showdown";
                }
            } else if (stage === "showdown") {
                bot.showCards();
            } else {
                stage = "pre-flop";
            }
            break;
        default:
            break;
    }
}

/* EVENT LISTENERS */
function mouseClicked() {
    switch (page) {
        case "home":
            break;
        case "play":
            if (toPlay === "player") {
                player.click();
            }
            break;
        default:
            break;
    }
}

function mousePressed() {
    switch (page) {
        case "home":
            break;
        case "play":
            player.pressed();
            break;
        default:
            break;
    }
}

function mouseReleased() {
    switch (page) {
        case "home":
            break;
        case "play":
            player.released();
            break;
        default:
            break;
    }
}

function mouseDragged() {
    switch (page) {
        case "home":
            break;
        case "play":
            player.drag();
            break;
        default:
            break;
    }
}

/* OTHER FUNCTIONS */
function textBubble(x, y, w, h, message, col, textCol, shadow = true) {
    noStroke();
    rectMode(CENTER);
    if (shadow) {
        fill(0, 120);
        rect(x, y, w + 3, h + 4, h);
    }
    fill(col);
    rect(x, y, w, h, h);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(h * 0.6);
    fill(textCol);
    text(message.toUpperCase(), x, y);
}

function drawTable() {
    let tablePos = createVector(width / 2, height / 2 - 100);
    let tableSize = createVector(600, 300);
    let tableBorder = 0.98;

    noStroke();

    fill(255);
    rectMode(CENTER);
    rect(tablePos.x, tablePos.y, tableSize.x, tableSize.y);
    rectMode(CORNER);
    ellipse(tablePos.x - tableSize.x / 2, tablePos.y, tableSize.y, tableSize.y);
    ellipse(tablePos.x + tableSize.x / 2, tablePos.y, tableSize.y, tableSize.y);

    fill(tableColor);
    rectMode(CENTER);
    rect(tablePos.x, tablePos.y, tableSize.x * tableBorder, tableSize.y * tableBorder);
    rectMode(CENTER);
    ellipse(tablePos.x - tableSize.x / 2, tablePos.y, tableSize.y * tableBorder, tableSize.y * tableBorder);
    ellipse(tablePos.x + tableSize.x / 2, tablePos.y, tableSize.y * tableBorder, tableSize.y * tableBorder);

    // textBubble(
    //     width / 2, height / 2 - 200, 200, 25,
    //     "Total Pot: $" + (totalPot.amount + player.betSize.amount + bot.betSize.amount),
    //     color(0, 120), color(255),
    //     false
    // );

    for (let i = 0; i < communityCards.length; i++) {
        if (i < 5) {
            communityCards[i].draw(width / 2 - 140 + i * 70, height / 2 - 100, 0.8);
        }
    }

    if (message.length > 0) {
        // textBubble(
        //     width / 2, height / 2, 200, 25,
        //     message,
        //     color(0, 120), color(255),
        //     false
        // );
    }
}

function initializeRound() {
    // reset the deck
    deck = new Deck();

    // reset players
    player.reset();
    bot.reset();

    // initialize stage
    stage = "pre-flop";

    // move dealer button
    dealerPos = (dealerPos === "player") ? "bot" : "player";

    // give dealer button, place blinds, give cards
    if (dealerPos === "player") {
        player.hasDealerBtn = true;
        bot.hasDealerBtn = false;

        bot.setSmallBlind();
        player.setBigBlind();
        toPlay = "bot";

        bot.giveCard(deck.pickCard());
        player.giveCard(deck.pickCard());
        bot.giveCard(deck.pickCard());
        player.giveCard(deck.pickCard());
    } else {
        player.hasDealerBtn = false;
        bot.hasDealerBtn = true;

        player.setSmallBlind();
        bot.setBigBlind();
        toPlay = "player";

        player.giveCard(deck.pickCard());
        bot.giveCard(deck.pickCard());
        player.giveCard(deck.pickCard());
        bot.giveCard(deck.pickCard());
    }
}

function loadImages() {
    chip = loadImage('assets/chip.png');
    club = loadImage('assets/club.png');
    diamond = loadImage('assets/diamond.png');
    heart = loadImage('assets/heart.png');
    spade = loadImage('assets/spade.png');
    foldIcon = loadImage('assets/fold.png');
    raiseIcon = loadImage('assets/raise.png');
    checkIcon = loadImage('assets/check.png');
}